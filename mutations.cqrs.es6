var R = require('ramda')
var path = require('path')
var fs = require('fs')
const PACKAGE = 'mutations.cqrs'
const checkRequired = require('./jesus').checkRequired
var checkRequiredFiles = require('./jesus').checkRequiredFiles

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
    errorThrow('mutation not defined', {mutationId})
  }
}

module.exports = async function getMutationsCqrsPackage ({getConsole,serviceName, serviceId, mutationsPath, mutationsStoragePackage}) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE)

  var applyMutationsFromPath = function applyMutationsFromPathFunc (originalState, mutations, mutationsPath) {
    var state = R.clone(originalState)
    CONSOLE.debug('applyMutationsFromPath', {state, mutations, mutationsPath})
    function applyMutation (state, mutation) {
      var mutationFile = path.join(mutationsPath, `${mutation.mutation}.${mutation.version}.js`)
      return require(mutationFile)(state, mutation.data)
    }
    return R.reduce(applyMutation, state, mutations)
  }

  try {
    checkRequired({serviceName, serviceId, mutationsPath, mutationsStoragePackage}, PACKAGE)
    checkRequiredFiles([mutationsPath], PACKAGE)
    return {
      mutate: async function mutate ({mutation, objId, data, meta}) {
        try {
          checkRequired({objId, mutation}, PACKAGE)
          var mutationsFunctions = getMutationsFunctions(mutationsPath)
          checkMutationFunction(mutation, mutationsFunctions)
          var lastMutationVersion = mutationsFunctions[mutation][0].mutationVersion
          var mutationState = {
            objId: objId,
            mutation,
            meta,
            version: lastMutationVersion,
            timestamp: new Date().getTime() / 1000,
            data
          }
          CONSOLE.debug('dataSingleMutation to create', {mutation, lastMutationVersion, objId, data, mutationState})
          await mutationsStoragePackage.insert({objs: [mutationState]})
          return mutationState
        } catch (error) {
          errorThrow('mutate(args) Error', {error, mutation, objId, data})
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
        CONSOLE.debug('getObjMutations', {objId, minTimestamp, results})
        return results
      },
      applyMutations: async function applyMutations ({state, mutations}) {
        CONSOLE.debug('applyMutationsFromPath', {state, mutations, mutationsPath})
        return applyMutationsFromPath(state, mutations, mutationsPath)
      }
    }
  } catch (error) {
    errorThrow('getMutationsCqrsPackage', {error, mutationsPath, mutationsStoragePackage})
  }
}
