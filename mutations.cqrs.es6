var R = require('ramda')
var path = require('path')
var fs = require('fs')
var LOG = console
const PACKAGE = 'mutations.cqrs'
const checkRequired = require('./jesus').checkRequired

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
  LOG.debug(PACKAGE, 'applyMutationsFromPath', {state, mutations, mutationsPath})
  function applyMutation (state, mutation) {
    var mutationFile = path.join(mutationsPath, `${mutation.mutation}.${mutation.version}.js`)
    return require(mutationFile)(state, mutation.data)
  }
  return R.reduce(applyMutation, state, mutations)
}

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
          LOG.debug(PACKAGE, 'dataSingleMutation to create', {mutation, lastMutationVersion, objId, data, mutationState})
          await mutationsStoragePackage.insert({objs: [mutationState]})
          return mutationState
        } catch (error) {
          LOG.error(PACKAGE, error, {mutation, objId, data})
          throw 'mutate(args) Error'
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
        LOG.debug(PACKAGE, 'getObjMutations', {objId, minTimestamp, results})
        return results
      },
      applyMutations: async function applyMutations ({state, mutations}) {
        LOG.debug(PACKAGE, 'applyMutationsFromPath', {state, mutations, mutationsPath})
        return applyMutationsFromPath(state, mutations, mutationsPath)
      }
    }
  } catch (error) {
    LOG.error(PACKAGE, error)
    throw PACKAGE+' getMutationsCqrsPackage'
  }
}
