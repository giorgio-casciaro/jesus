module.exports = function getAuthorizationsPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'auth.RoleBased'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, [], PACKAGE)
    DI = checkRequired(DI, [ 'throwError', 'log', 'debug'], PACKAGE)
    return {
      async authorize ({action, entityName, items, itemsIds, meta, userData}) {
        try {
          if (!entityName) throw new Error('authorize() entityName is required')
          if (!action) throw new Error('authorize() action is required')
          if (!userData.roleId) throw new Error('roleId is required')

          //calculate possible action values es write.create = *, write, write.create
          var findActionIn = ['*']
          action.split('.').forEach((value, returned) => {
            var str = (returned) ? returned + '.' + value : value
            findActionIn.push(str)
            return str
          }, false)

          var storagePackage = CONFIG.storage(CONFIG, DI)
          var Permissions = await storagePackage.find({'action': { $in: findActionIn }, 'entity': entityName, 'roleId': userData.roleId })

          // TO FIX ->  REMOVE DUPLICATES BY ID, SORT  BY ENTITY DEFINITION, SORT BY ACTION DEFINITION,SORT BY PRIORITY,
          if (!Permissions || !Permissions[0] || !Permissions[0].permit) throw new Error(`you not have permission to ${action} ${entityName}`)
          DI.debug({msg: `Permissions ${entityName} authorize()`, context: PACKAGE, debug: {Permissions}})
        } catch (error) {
          DI.throwError(`ENTITY: ${entityName} you are not authorized`, error, {action, entityName, items, itemsIds, meta})
        }
      }
    }
  } catch (error) {
    DI.throwError('getAuthorizationsPackage(CONFIG, DI)', error)
  }
}

// {

// }
