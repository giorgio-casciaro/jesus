
module.exports = function getStoragePackage (CONFIG, DI) {
  try {
    const PACKAGE = 'storage'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['storageType', 'storageConfig', 'storageCollection'], PACKAGE)
    DI = checkRequired(DI, [], PACKAGE)

    var getStorageAction = async (action, args) => {
      try {
        var type = await getValuePromise(CONFIG.storageType)
        var storage = await require('./storage.' + type)(CONFIG, DI)
        var results = await storage[action](args)
        return results
      } catch (error) {
        DI.throwError(PACKAGE + ' getStorageAction ', error, args)
      }
    }
    return {
      insert: async(args) => getStorageAction('insert', args),
      find: async(args) => getStorageAction('find', args),
      get: async(args) => getStorageAction('get', args),
      update: async(args) => getStorageAction('update', args)
    }
  } catch (error) {
    DI.throwError(PACKAGE + ' getStoragePackage ', error)
  }
}
