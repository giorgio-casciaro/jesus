var entityCqrs = require('../../../entity.cqrs')
var jesus = require('../../../jesus')
const uuidV4 = require('uuid/v4')
const netClient = require('../../../net.client')

var serviceName = require('./config').serviceName
var serviceId = require('./serviceId.json')
var getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath)
var getConsole = (serviceName, serviceId, pack) => jesus.getConsole(require('./config').console, serviceName, serviceId, pack)

const PACKAGE = 'methods'
var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
var errorThrow = jesus.errorThrow(serviceName, serviceId, PACKAGE)

const validateMethodRequest = async (methodName, data) => jesus.validateMethodFromConfig(serviceName, serviceId, await getSharedConfig(serviceName, 'methods'), methodName, data, 'requestSchema')
const validateMethodResponse = async (methodName, data) => jesus.validateMethodFromConfig(serviceName, serviceId, await getSharedConfig(serviceName, 'methods'), methodName, data, 'responseSchema')

var netClientPackage = netClient({getSharedConfig, serviceName, serviceId, getConsole})

function filterViews (views) {
  views.forEach(view => {
    if (view.email) delete view.email
    if (view._viewHash) delete view._viewHash
  })
  return views
}

async function updateViews (entityConfig, views, meta) {
  if (!views || !views.length) return false
  views = filterViews(views)
  CONSOLE.debug(`updateViews() filtered views`, views)
  netClientPackage.emit('viewsUpdated', views, meta)
  var storagePackage = await entityConfig.storage({getConsole, serviceName, serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig})
  await storagePackage.insert({objs: views})
  return views
}

module.exports = {
  async  viewsUpdated (views, meta) {
    try {
      var entityConfig = require('./config.ResourceView')
      CONSOLE.debug(`start viewsUpdated()`, {views, meta})
      await updateViews(entityConfig, views, meta)
      return {success: true}
    } catch (error) {
      CONSOLE.warn('problems during viewsUpdated', error)
      return {error: 'problems during viewsUpdated', originalError: error}
    }
  },
  async  rebuildViews ({}, meta) {
    try {
      CONSOLE.debug(`start rebuildViews() requestId:` + meta.requestId)
      var entityConfig = require('./config.ResourceView')
      var loop = true
      var page = 0
      var timestamp = Date.now()
      var pageItems = 10
      while (loop) {
        page++
        var views = await netClientPackage.rpc('resources', 'listResources', {page, timestamp, pageItems}, meta)
        CONSOLE.debug(`rebuildViews() listResources response`, views)
        await updateViews(entityConfig, views, meta)
        if (!views || !views.length || views.length < pageItems)loop = false
      }
      return {success: true}
    } catch (error) {
      CONSOLE.warn('problems during rebuildViews', error)
      return {error: 'problems during rebuildViews', originalError: error}
    }
  },
  async  syncViews ({}, meta) {
    try {
      CONSOLE.debug(`start syncViews() requestId:` + meta.requestId)
      var entityConfig = require('./config.ResourceView')
      var storagePackage = await entityConfig.storage({getConsole,serviceName, serviceId, storageCollection: entityConfig.storageCollection, storageConfig: entityConfig.storageConfig})
      var page = 0
      var timestamp = Date.now()
      var pageItems = 10
      // FIND VIEWS IDS TO UPDATE BY CHECKSUM
      var viewsToUpdate = []
      var loop = true
      while (loop) {
        page++
        var viewsChecksums = await netClientPackage.rpc('resources', 'listResources', {page, timestamp, pageItems, checksumOnly: true}, meta)
        CONSOLE.debug(`syncViews() listResources checksum response`, {page, timestamp, pageItems, viewsChecksums})
        if (viewsChecksums && viewsChecksums.length) {
          var query = {$or: viewsChecksums}
          var toNotUpdate = await storagePackage.find({query, fields: { _id: 1 } })
          var viewsChecksumsIds = viewsChecksums.map(view => view._id)
          var idsToNotUpdate = toNotUpdate.map(view => view._id)
          var idsToUpdate = viewsChecksumsIds.filter(viewId => idsToNotUpdate.indexOf(viewId) === -1)
          viewsToUpdate = viewsToUpdate.concat(idsToUpdate)
          CONSOLE.debug(`syncViews() storagePackage.find`, {query, toNotUpdate, idsToUpdate})
        }
        if (!viewsChecksums || !viewsChecksums.length || viewsChecksums.length < pageItems)loop = false
      }
      // QUERY VIEWS BY ID AND UPDATE
      CONSOLE.debug(`syncViews() viewsToUpdate requestId:` + meta.requestId, viewsToUpdate)
      if (viewsToUpdate.length) {
        var views = await netClientPackage.rpc('resources', 'listResources', {idIn: viewsToUpdate}, meta)
        // var views = await netClientPackage.emit('listResources', {idIn: viewsToUpdate}, meta)
        CONSOLE.debug(`syncViews() listResources response`, views)
        await updateViews(entityConfig, views, meta)
      }

      return {success: true}
    } catch (error) {
      CONSOLE.warn('problems during syncViews', error)
      return {error: 'problems during syncViews', originalError: error}
    }
  }
}
