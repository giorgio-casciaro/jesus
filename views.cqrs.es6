var R = require('ramda')
// var path = require('path')
// var fs = require('fs')
var jesus = require('./jesus')
function debug () {
  console.log('\u001b[1;33m' +
    '<CWRS VIEWS>' +
    '\u001b[0m')
  console.log.apply(console, arguments)
}

module.exports = async function getViewsCqrsPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'views.cqrs'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['viewsSnapshotsMaxMutations'], PACKAGE)
    DI = checkRequired(DI, ['viewsStoragePackage', 'viewsSnapshotsStoragePackage', 'mutationsPackage', 'error', 'log', 'debug'], PACKAGE)

    async function updateEntityView (itemId, loadSnapshot = true, newMutations = false) {
      try {
        var lastSnapshot
        if (loadSnapshot) {
          var lastSnapshotFromDb = await DI.viewsSnapshotsStoragePackage.find({itemId: itemId}, {timestamp: 1}, 0, 1)
          if (lastSnapshotFromDb && lastSnapshotFromDb[0]) lastSnapshot = lastSnapshotFromDb[0]
        }
        if (!lastSnapshot)lastSnapshot = {timestamp: 0, state: {}}

        if (newMutations === false) {
          newMutations = await DI.mutationsPackage.getEntityMutations({itemId, minTimestamp: lastSnapshot.timestamp})
        }

        var updatedView = await DI.mutationsPackage.applyMutations({state: lastSnapshot.state, mutations: newMutations})
        DI.viewsStoragePackage.update({queriesArray: [{'_id': itemId}], dataArray: [updatedView], insertIfNotExists: true})
        DI.debug({msg: 'updatedView', context: PACKAGE, debug: {updatedView}})

        if (DI.snapshotsMaxMutations < newMutations && newMutations.length) {
          await DI.viewsSnapshotsStorage.insert({timestamp: Date.now(), state: updatedView}) // update snapshot if required
        }
        return true
      } catch (error) {
        DI.throwError(PACKAGE + ' updateEntityView(args)', error, {itemId, loadSnapshot, newMutations})
      }
    }
    return {
      refreshItemsViews: function refreshItemsViews ({itemsIds, loadSnapshot = false, itemsMutations = false}) {
        function singleItemView (itemId, index) {
          var newMutations = (itemsMutations && itemsMutations[index]) ? itemsMutations[index] : false
          return updateEntityView(itemId, loadSnapshot, newMutations)
        }
        return Promise.all(R.addIndex(R.map)(singleItemView, itemsIds))
      },
      get: DI.viewsStoragePackage.get
    }
  } catch (error) {
    DI.throwError('getViewsCqrsPackage(CONFIG, DI)', error)
  }
}
