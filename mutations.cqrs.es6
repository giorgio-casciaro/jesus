var R = require('ramda')
var path = require('path')
var fs = require('fs')
function debug () {
  console.log('\u001b[1;33m' +
    '<State Mutations>' +
    '\u001b[0m')
  console.log.apply(console, arguments)
}
// var checkNullId = function checkNullId (instance) {
//   if (!instance._id) {
//     delete instance._id
//   }
//   return instance
// }

function createItemsMutations (mutationId, mutationVersion, mutationsitemsIds, mutationsArgs) {
  // debug('createItemsMutations', mutationId, mutationVersion, items)
  var mutations = R.addIndex(R.map)((itemId, index) => {
    return {
      itemId,
      mutation: mutationId,
      version: mutationVersion,
      time: new Date().getTime() / 1000,
      data: (mutationsArgs && mutationsArgs[index])
        ? mutationsArgs[index]
        : {}
    }
  }, mutationsitemsIds)
  return mutations
}

// function applyMutations (mutationsFunctions, mutations, states) {
//   debug('applyMutations', mutationsFunctions, mutations, states)
//   states = states || {}
//   var mutationsByEntity = R.groupBy(R.prop('itemId'), mutations)
//   var statesByEntity = R.zipObj(R.map(R.prop('itemId', states)), states)
//   for (let itemId in mutationsByEntity) {
//     for (let mutation of mutationsByEntity[itemId]) {
//       statesByEntity[itemId] = mutationsFunctions[mutation.mutation][mutation.version](statesByEntity[itemId] || {}, mutation.data)
//     }
//   }
//   debug('appliedMutations', statesByEntity)
//   return R.values(statesByEntity)
// }

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

function applyMutationsFromPath (state, mutations, mutationsPath) {
  state = R.clone(state)
  function applyMutation (state, mutation) {
    var mutationFile=path.join(mutationsPath, `${mutation.mutation}.${mutation.version}.js`)
    return require(mutationFile)(state, mutation.data)
  }
  return R.reduce(applyMutation, state, mutations)
}

function checkMutationFunction (mutationId, mutationsFunctions) {
  if (!mutationsFunctions[mutationId] || !mutationsFunctions[mutationId][0]) {
    throw new Error('mutation non definita')
  }
}

// function getFunctions (basePath, filterByMutationId, filterByVersion) {
//   var versions = getVersions(basePath)
//   if (filterByMutationId) {
//     versions = {
//       [filterByMutationId]: versions[filterByMutationId]
//     }
//   }
//   if (filterByVersion) {
//     versions[filterByMutationId] = [filterByVersion]
//   }
//   var mutationsFunctions = R.mapObjIndexed((val, muName, obj) => R.zipObj(val, R.map((muVers) => require(`${basePath}/${muName}.${muVers}`), val)), versions)
//   debug('getFunctions', mutationsFunctions)
//   return mutationsFunctions
// }

module.exports = async function getMutationsCqrsPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'mutations.cqrs'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['mutationsPath'], PACKAGE)
    DI = checkRequired(DI, ['mutationsStoragePackage','error', 'log', 'debug'], PACKAGE)
    return {
      mutate: async function mutate ({mutation, itemsIds, items}) {
        try {
          var configMutationsPath = await getValuePromise(CONFIG.mutationsPath)
          var mutationsFunctions = getMutationsFunctions(configMutationsPath)
          checkMutationFunction(mutation, mutationsFunctions)
          var lastMutationVersion = mutationsFunctions[mutation][0].mutationVersion
          var itemsMutations = createItemsMutations(mutation, lastMutationVersion, itemsIds, items)
          DI.debug({msg: 'itemsMutations to create', context: PACKAGE, debug: {mutation, lastMutationVersion, itemsIds, items, itemsMutations}})
          await DI.mutationsStoragePackage.insert({items: itemsMutations})
          return itemsMutations
        } catch (error) {
          DI.throwError(PACKAGE + ' mutate(args) Error', error, {mutation, itemsIds, items})
        }
      },
      getEntityMutations: function getEntityMutations ({itemId, minTimestamp}) {
        return DI.mutationsStoragePackage.find({
          itemId: itemId,
          timestamp: {
            $gte: minTimestamp || 0
          }
        }, {timestamp: 1})
      },
      applyMutations: async function applyMutations ({state, mutations}) {
        var mutationsPath = await getValuePromise(CONFIG.mutationsPath)
        return applyMutationsFromPath(state, mutations, mutationsPath)
      }
    }
  } catch (error) {
    DI.throwError('getMutationsCqrsPackage(CONFIG, DI)', error)
  }
}
