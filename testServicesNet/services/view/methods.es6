const jesus = require('../../../jesus')
const PACKAGE = 'methods'
const serviceName = require('./config').serviceName
const serviceId = require('./serviceId.json')

const getSharedConfig = jesus.getSharedConfig(require('./config').sharedServicesPath)
const getConsole = (serviceName, serviceId, pack) => jesus.getConsole(require('./config').console, serviceName, serviceId, pack)
const CONSOLE = getConsole(serviceName, serviceId, PACKAGE)

const getNetClient = async () => {
  var config = await getSharedConfig(serviceName, 'net')
  return require('../../../net.client')({getSharedConfig, serviceName, serviceId, getConsole, config})
}
const netEmit = async (args) => {
  var client = await getNetClient()
  return await client.emit(args)
}
const netRpc = async (to,method,data,meta) => {
  var client = await getNetClient()
  return await client.rpc({to, method, data, meta})
}

var entityConfig = require('./config.ResourceView')

const getStorage = () => require('../../../storage.inmemory')({getConsole, serviceName, serviceId, storageConfig: require('./config').storage})
const storageFind = (args) => getStorage().find(Object.assign(args, {collectionName: entityConfig.collection})) // ASYNC
const storageInsert = (objs) => getStorage().insert({collectionName: entityConfig.collection, objs}) // ASYNC

const authorize = (data) => netEmit('authorize', data, data.meta, true)// ASYNC

function filterViews (views) {
  views.forEach(view => {
    if (view.email) delete view.email
    if (view._viewHash) delete view._viewHash
  })
  return views
}

async function updateViews (views, meta) {
  if (!views || !views.length) return false
  views = filterViews(views)
  CONSOLE.debug(`updateViews() filtered views`, views)
  netEmit('viewsUpdated', views, meta)
  await storageInsert(views)
  return views
}

module.exports = {
  async  viewsUpdated (views, meta) {
    try {
      CONSOLE.debug(`start viewsUpdated()`, {views, meta})
      await updateViews(views, meta)
      return {success: true}
    } catch (error) {
      CONSOLE.warn('problems during viewsUpdated', error)
      return {error: 'problems during viewsUpdated', originalError: error}
    }
  },
  async  rebuildViews (data, meta) {
    try {
      CONSOLE.debug(`start rebuildViews() corrid:` + meta.corrid,{data, meta})
      var loop = true
      var page = 0
      var timestamp = Date.now()
      var pageItems = 10
      while (loop) {
        page++
        var views = await netRpc('resources', 'listResources', {page, timestamp, pageItems}, meta)
        CONSOLE.debug(`rebuildViews() listResources response`, views)
        await updateViews(views, meta)
        if (!views || !views.length || views.length < pageItems)loop = false
      }
      return {success: true}
    } catch (error) {
      CONSOLE.warn('problems during rebuildViews', error)
      return {error: 'problems during rebuildViews', originalError: error}
    }
  },
  async  syncViews (data, meta) {
    try {
      CONSOLE.debug(`start syncViews() `,{data, meta})
      var page = 0
      var timestamp = Date.now()
      var pageItems = 10
      // FIND VIEWS IDS TO UPDATE BY CHECKSUM
      var viewsToUpdate = []
      var loop = true
      while (loop) {
        page++
        var viewsChecksums = await netRpc('resources', 'listResources', {page, timestamp, pageItems, checksumOnly: true}, meta)
        CONSOLE.debug(`syncViews() listResources checksum response`, {page, timestamp, pageItems, viewsChecksums})
        if (viewsChecksums && viewsChecksums.length) {
          var query = {$or: viewsChecksums}
          var toNotUpdate = await storageFind({ query, fields: { _id: 1 } })
          var viewsChecksumsIds = viewsChecksums.map(view => view._id)
          var idsToNotUpdate = toNotUpdate.map(view => view._id)
          var idsToUpdate = viewsChecksumsIds.filter(viewId => idsToNotUpdate.indexOf(viewId) === -1)
          viewsToUpdate = viewsToUpdate.concat(idsToUpdate)
          CONSOLE.debug(`syncViews() storageFind`, {query, toNotUpdate, idsToUpdate})
        }
        if (!viewsChecksums || !viewsChecksums.length || viewsChecksums.length < pageItems)loop = false
      }
      // QUERY VIEWS BY ID AND UPDATE
      CONSOLE.debug(`syncViews() viewsToUpdate corrid:` + meta.corrid, viewsToUpdate)
      if (viewsToUpdate.length) {
        var views = await netRpc('resources', 'listResources', {idIn: viewsToUpdate}, meta)
        // var views = await netEmit('listResources', {idIn: viewsToUpdate}, meta)
        CONSOLE.debug(`syncViews() listResources response`, views)
        await updateViews(views, meta)
      }

      return {success: true}
    } catch (error) {
      CONSOLE.warn('problems during syncViews', error)
      return {error: 'problems during syncViews', originalError: error}
    }
  }
}
