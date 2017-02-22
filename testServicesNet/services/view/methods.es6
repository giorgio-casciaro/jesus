var jesus = require('../../../jesus')

var serviceName = require('./config').serviceName
var serviceId = require('./serviceId.json')
var sharedServicesPath = require('./config').sharedServicesPath
var sharedServicePath = require('./config').sharedServicePath
const netClient = require('../../../net.client')

process.on('unhandledRejection', (reason, promise) => LOG.error('unhandledRejection Reason: ', promise, reason))

const PACKAGE = 'methods'
var LOG = jesus.LOG(serviceName, serviceId, PACKAGE)
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE)

const NET_CLIENT_ARGS = {sharedServicesPath, sharedServicePath, serviceName, serviceId}
var netClientPackage = netClient(NET_CLIENT_ARGS)

module.exports = {
  async  viewsUpdated (views, meta) {
    try {
      var entityConfig = require('./config.ResourceView')
      LOG.debug(`start viewsUpdated()`, {views, meta})
      var storagePackage = await entityConfig.storage({serviceName, serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig})
      storagePackage.insert({objs: views})
      return {success: true}
    } catch (error) {
      LOG.warn('problems during viewsUpdated', error)
      return {error: 'problems during viewsUpdated', originalError: error}
    }
  },
  async  rebuildViews ({}, meta) {
    try {
      LOG.debug(`start rebuildViews()`)
      var entityConfig = require('./config.ResourceView')
      var storagePackage = await entityConfig.storage({serviceName, serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig})
      var loop = true
      var page = 0
      var timestamp = Date.now()
      var pageItems = 10
      while (loop) {
        page++
        var views = await netClientPackage.emit('listResources', {page, timestamp, pageItems})
        LOG.debug(`rebuildViews() listResources response`, {page, timestamp, pageItems, views})
        if (views && views.length)storagePackage.insert({objs: views})
        if (!views || !views.length || views.length < pageItems)loop = false
      }
      return {success: true}
    } catch (error) {
      LOG.warn('problems during rebuildViews', error)
      return {error: 'problems during rebuildViews', originalError: error}
    }
  },
  async  syncViews ({}, meta) {
    try {
      LOG.debug(`start syncViews()`)
      var entityConfig = require('./config.ResourceView')
      var storagePackage = await entityConfig.storage({serviceName, serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig})
      var page = 0
      var timestamp = Date.now()
      var pageItems = 10
      //FIND VIEWS IDS TO UPDATE BY CHECKSUM
      var viewsToUpdate = []
      var loop = true
      while (loop) {
        page++
        var viewsChecksums = await netClientPackage.emit('listResources', {page, timestamp, pageItems, checksumOnly: true})
        LOG.debug(`syncViews() listResources response`, {page, timestamp, pageItems, viewsChecksums})
        if (viewsChecksums && viewsChecksums.length) {
          var query = {$or: viewsChecksums}
          var toNotUpdate = await storagePackage.find({query, fields: { _id: 1 } })
          var viewsChecksumsIds=viewsChecksums.map(view => view._id)
          var idsToNotUpdate = toNotUpdate.map(view => view._id)
          var idsToUpdate=viewsChecksumsIds.filter(viewId => idsToNotUpdate.indexOf(viewId)===-1)
          viewsToUpdate = viewsToUpdate.concat(idsToUpdate)
          LOG.debug(`syncViews() storagePackage.find`, {query, toNotUpdate, idsToUpdate})
        }
        if (!viewsChecksums || !viewsChecksums.length || viewsChecksums.length < pageItems)loop = false
      }
      //QUERY VIEWS BY ID AND UPDATE
      LOG.debug(`syncViews() viewsToUpdate`, viewsToUpdate)
      if(viewsToUpdate.length){
        var views = await netClientPackage.emit('listResources', {idIn:viewsToUpdate})
        if (views && views.length)storagePackage.insert({objs: views})
      }

      return {success: true}
    } catch (error) {
      LOG.warn('problems during syncViews', error)
      return {error: 'problems during syncViews', originalError: error}
    }
  }
}
