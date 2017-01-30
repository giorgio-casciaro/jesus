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

function createItemsMutation (mutationId, mutationVersion, mutationsItemsIds, mutationsArgs) {
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
  }, mutationsItemsIds)
  return mutations
}

// function applyMutations (mutationsFunctions, mutations, states) {
//   debug('applyMutations', mutationsFunctions, mutations, states)
//   states = states || {}
//   var mutationsByItem = R.groupBy(R.prop('itemId'), mutations)
//   var statesByItem = R.zipObj(R.map(R.prop('itemId', states)), states)
//   for (let itemId in mutationsByItem) {
//     for (let mutation of mutationsByItem[itemId]) {
//       statesByItem[itemId] = mutationsFunctions[mutation.mutation][mutation.version](statesByItem[itemId] || {}, mutation.data)
//     }
//   }
//   debug('appliedMutations', statesByItem)
//   return R.values(statesByItem)
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
    // console.log(`applyMutationsFromPath ${mutation.mutation}.${mutation.version}.js`)
    var mutationFile = path.join(mutationsPath, `${mutation.mutation}.${mutation.version}.js`)
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
    DI = checkRequired(DI, ['mutationsStoragePackage', 'error', 'log', 'debug'], PACKAGE)
    return {
      mutate: async function mutate ({mutation, itemsIds, items}) {
        try {
          var configMutationsPath = await getValuePromise(CONFIG.mutationsPath)
          var mutationsFunctions = getMutationsFunctions(configMutationsPath)
          checkMutationFunction(mutation, mutationsFunctions)
          var lastMutationVersion = mutationsFunctions[mutation][0].mutationVersion
          // DI.debug({msg: 'createItemsMutations', context: PACKAGE, debug: {mutation, lastMutationVersion, itemsIds, items}})

          var itemsSingleMutation = createItemsMutation(mutation, lastMutationVersion, itemsIds, items)
          DI.debug({msg: 'itemsSingleMutation to create', context: PACKAGE, debug: {mutation, lastMutationVersion, itemsIds, items, itemsSingleMutation}})
          await DI.mutationsStoragePackage.insert({items: itemsSingleMutation})
          return itemsSingleMutation
        } catch (error) {
          DI.throwError(PACKAGE + ' mutate(args) Error', error, {mutation, itemsIds, items})
        }
      },
      getItemMutations: async function getItemMutations ({itemId, minTimestamp = 0}) {
        // TO FIX
        var results = await DI.mutationsStoragePackage.find({
          query: {
            itemId: itemId,
            //timestamp: {$gte: minTimestamp}// TO FIX
          },
          sort: {timestamp: 1}
        })
        DI.debug({msg: 'getItemMutations', context: PACKAGE, debug: {itemId, minTimestamp, results}})
        return results
      },
      applyMutations: async function applyMutations ({state, mutations}) {
        var mutationsPath = await getValuePromise(CONFIG.mutationsPath)

        DI.debug({msg: 'applyMutationsFromPath', context: PACKAGE, debug: {state, mutations, mutationsPath}})
        return applyMutationsFromPath(state, mutations, mutationsPath)
      }
    }
  } catch (error) {
    DI.throwError('getMutationsCqrsPackage(CONFIG, DI)', error)
  }
}
