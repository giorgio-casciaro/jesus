var R = require('ramda')
var path = require('path')
var fs = require('fs')
var jesus = require('jesus')
function debug () {
  console.log('\u001b[1;33m' +
    '<State RefreshViews>' +
    '\u001b[0m')
  console.log.apply(console, arguments)
}
// var checkNullId = function checkNullId (instance) {
//   if (!instance._id) {
//     delete instance._id
//   }
//   return instance
// }

// function applyRefreshViews (mutationsFunctions, mutations, states) {
//   debug('applyRefreshViews', mutationsFunctions, mutations, states)
//   states = states || {}
//   var mutationsByEntity = R.groupBy(R.prop('entityId'), mutations)
//   var statesByEntity = R.zipObj(R.map(R.prop('entityId', states)), states)
//   for (let entityId in mutationsByEntity) {
//     for (let mutation of mutationsByEntity[entityId]) {
//       statesByEntity[entityId] = mutationsFunctions[mutation.mutation][mutation.version](statesByEntity[entityId] || {}, mutation.data)
//     }
//   }
//   debug('appliedRefreshViews', statesByEntity)
//   return R.values(statesByEntity)
// }

// function getFunctions (basePath, filterByRefreshViewId, filterByVersion) {
//   var versions = getVersions(basePath)
//   if (filterByRefreshViewId) {
//     versions = {
//       [filterByRefreshViewId]: versions[filterByRefreshViewId]
//     }
//   }
//   if (filterByVersion) {
//     versions[filterByRefreshViewId] = [filterByVersion]
//   }
//   var mutationsFunctions = R.mapObjIndexed((val, muName, obj) => R.zipObj(val, R.map((muVers) => require(`${basePath}/${muName}.${muVers}`), val)), versions)
//   debug('getFunctions', mutationsFunctions)
//   return mutationsFunctions
// }

function updateEntityView (DI, entityId) {
  return new Promise(async function updateEntityViewPromise (resolve) {
    var lastSnapshot = await DI.snapshotsStorage.findSortLimit({entityId: entityId}, {timestamp: 1}, [0, 1])
    lastSnapshot = lastSnapshot && lastSnapshot[0] ? lastSnapshot[0] : {timestamp: 0, state: {}}
    var newMutations = DI.mutations.getEntityMutations(entityId, lastSnapshot.timestamp)
    var updatedView = applyMutations(lastSnapshot.state, newMutations)
    DI.storage.update([{'_id': entityId}], [updatedView], true)
  // update snapshot if required
    if (DI.snapshotsMaxMutations < newMutations && newMutations.length) {
      await DI.snapshotsStorage.insert({timestamp: Date.now(), state: updatedView})
    }
  })
}

module.exports = function getRefreshViewFunction (DI) {
  jesus.checkRequiredDependencies(DI, ['snapshotsMaxMutations', 'storage', 'mutations', 'snapshotsStorage'])
  return function refreshView (entitiesIds) {
    return Promise.all(R.map((entityId) => updateEntityView(DI, entityId), entitiesIds))
  }
}
