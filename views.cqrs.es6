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

    async function updateItemView ({itemId, loadSnapshot = true, loadMutations = true, addMutations = []}) {
      try {
        DI.debug({msg: 'updateItemView', context: PACKAGE, debug: {itemId, loadSnapshot, loadMutations, addMutations}})
        var lastSnapshot = {timestamp: 0, state: {}}
        var mutations = []
        if (loadSnapshot) {
          var lastSnapshotFromDb = await DI.viewsSnapshotsStoragePackage.find({query: {itemId: itemId}, sort: {timestamp: 1}, limit: 1, start: 0})
          if (lastSnapshotFromDb && lastSnapshotFromDb[0]) lastSnapshot = lastSnapshotFromDb[0]
        }
        if (loadMutations)mutations = await DI.mutationsPackage.getItemMutations({itemId, minTimestamp: lastSnapshot.timestamp})
        
        mutations = mutations.concat(addMutations)
        //clear array, remove duplicate ids
        mutations = R.uniqWith(R.prop("_id"),mutations);
        var updatedView = await DI.mutationsPackage.applyMutations({state: lastSnapshot.state, mutations})
        DI.viewsStoragePackage.update({queriesArray: [{'_id': itemId}], dataArray: [updatedView], insertIfNotExists: true})
        DI.debug({msg: 'updatedView', context: PACKAGE, debug: {updatedView,mutations}})

        if (DI.snapshotsMaxMutations < mutations && mutations.length) {
          await DI.viewsSnapshotsStorage.insert({timestamp: Date.now(), state: updatedView}) // update snapshot if required
        }
        return true
      } catch (error) {
        DI.throwError(PACKAGE + ' updateItemView(args)', error, {itemId, loadSnapshot, loadMutations, addMutations})
      }
    }
    return {
      refreshItemsViews: function refreshItemsViews ({itemsIds, loadSnapshot, loadMutations, addMutations }) {
        DI.debug({msg: 'refreshItemsViews', context: PACKAGE, debug: {itemsIds, loadSnapshot, addMutations}})
        function singleItemView (itemId, index) {
          var checkedMutations = (addMutations && addMutations[index]) ? addMutations[index] : []
          return updateItemView({itemId, loadSnapshot, loadMutations, addMutations:checkedMutations})
        }
        return Promise.all(R.addIndex(R.map)(singleItemView, itemsIds))
      },
      get: DI.viewsStoragePackage.get
    }
  } catch (error) {
    DI.throwError('getViewsCqrsPackage(CONFIG, DI)', error)
  }
}
