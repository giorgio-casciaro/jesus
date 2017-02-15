var R = require('ramda')
var path = require('path')
var fs = require('fs')
var LOG = console

function getMutationsFunctions (basePath) {
  var filesJsNoExtension = R.map(R.compose(R.replace('.js', ''), path.basename), R.filter((file) => path.extname(file) === '.js', fs.readdirSync(basePath)))
  var splitFiles = R.map(R.split('.'))
  var sortFiles = R.compose(R.reverse, R.sortBy(R.compose(parseInt, R.prop(0))))
  var groupFiles = R.groupBy(R.prop(0))
  var addFunction = R.map(R.map((element) => {
    return {mutationId: element[0], mutationVersion: element[1]}
  }))
  var mutationsFunctions = R.compose(addFunction, groupFiles, sortFiles, splitFiles)(filesJsNoExtension)
  // debug('getMutationsFunctions', mutationsFunctions)
  return mutationsFunctions
}

function checkMutationFunction (mutationId, mutationsFunctions) {
  if (!mutationsFunctions[mutationId] || !mutationsFunctions[mutationId][0]) {
    throw new Error('mutation non definita')
  }
}
var applyMutationsFromPath = function applyMutationsFromPathFunc (originalState, mutations, mutationsPath) {
  var state = R.clone(originalState)
  LOG.debug('applyMutationsFromPath',{context: PACKAGE, debug: {state, mutations, mutationsPath}})
  function applyMutation (state, mutation) {
    var mutationFile = path.join(mutationsPath, `${mutation.mutation}.${mutation.version}.js`)
    return require(mutationFile)(state, mutation.data)
  }
  return R.reduce(applyMutation, state, mutations)
}
// async function validateMutation (mutationName, data, mutationsPath) {
//   if (!data || !data.length) return null // non ci sono dati da validare
//   var validate = require('./validate.jsonSchema')
//   var validationSchema = path.join(mutationsPath, `${mutationName}.schema.json`)
//   var validationResults = await validate({data, validationSchema, throwIfFileNotFounded: false})
//   if (validationResults === false) LOG.warn({msg: 'mutation not have a schema expected:' + validationSchema, context: PACKAGE, data: {mutationName, data, mutationsPath}})
// }

const PACKAGE = 'mutations.cqrs'
const checkRequired = require('./jesus').checkRequired
module.exports = async function getMutationsCqrsPackage ({mutationsPath, mutationsStoragePackage}) {
  try {
    checkRequired({mutationsPath, mutationsStoragePackage}, PACKAGE)
    return {
      mutate: async function mutate ({mutation, objId, data}) {
        try {
          checkRequired({objId, mutation}, PACKAGE)
          var mutationsFunctions = getMutationsFunctions(mutationsPath)
          checkMutationFunction(mutation, mutationsFunctions)
          var lastMutationVersion = mutationsFunctions[mutation][0].mutationVersion
          var mutationState = {
            objId: objId,
            mutation,
            version: lastMutationVersion,
            timestamp: new Date().getTime() / 1000,
            data
          }
          LOG.debug('dataSingleMutation to create',{ context: PACKAGE, debug: {mutation, lastMutationVersion, objId, data, mutationState}})
          await mutationsStoragePackage.insert({objs: [mutationState]})
          return mutationState
        } catch (error) {
          LOG.error(PACKAGE, error, {mutation, objId, data})
          throw new Error(`mutate(args) Error`)
        }
      },
      getObjMutations: async function getObjMutations ({objId, minTimestamp = 0}) {
        var results = await mutationsStoragePackage.find({
          query: {
            objId: objId,
            timestamp: {$gte: minTimestamp}
          },
          sort: {timestamp: 1}
        })
        LOG.debug('getObjMutations',{ context: PACKAGE, debug: {objId, minTimestamp, results}})
        return results
      },
      applyMutations: async function applyMutations ({state, mutations}) {
        LOG.debug('applyMutationsFromPath',{context: PACKAGE, debug: {state, mutations, mutationsPath}})
        return applyMutationsFromPath(state, mutations, mutationsPath)
      }
    }
  } catch (error) {
    LOG.error(PACKAGE, error)
    throw new Error('getMutationsCqrsPackage')
  }
}
