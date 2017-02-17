const getValuePromise = require('./jesus').getValuePromise
const checkRequired = require('./jesus').checkRequired
var path = require('path')

module.exports = async function getEntityBasePackage (CONFIG, DI) {
  const PACKAGE = 'entity.base'
  CONFIG = checkRequired(CONFIG, ['entityName', 'validationsPath'], PACKAGE)
  DI = checkRequired(DI, [ 'throwError'], PACKAGE)
  var entityName = await getValuePromise(CONFIG.entityName)
  var storagePackage = await CONFIG.storage(CONFIG, DI)
  var validationsPath = await getValuePromise(CONFIG.validationsPath)
  var updateValidationFile = path.join(validationsPath, `update.schema.json`)

  return {
    async update ({itemsIds, items}) {
      try {
        if (!itemsIds || !items) throw new Error('ARG itemsIds, items are required')
        var validate = require('./validate.jsonSchema')
        var validationResults = await validate({items, validationSchema: updateValidationFile, throwIfFileNotFounded: true})
        await storagePackage.update({
          queriesArray: R.map((itemId) => ({'_id': itemId}), itemsIds),
          dataArray: items,
          insertIfNotExists: true})
        DI.debug({msg: `ENTITY: ${entityName} update()`, context: PACKAGE, debug: {itemsIds, items}})
        return itemsIds
      } catch (error) {
        DI.throwError(`ENTITY: ${entityName} update()`, error, {itemsIds, items})
      }
    },
    async read ({itemsIds}) {
      try {
        if (!itemsIds) throw new Error(`ENTITY: ${entityName} read(itemsIds)  required args`)
        var items = await storagePackage.get({ids: itemsIds})
        DI.debug({msg: `ENTITY: ${entityName} read()`, context: PACKAGE, debug: {itemsIds, items}})
        return items
      } catch (error) {
        DI.throwError(`ENTITY: ${entityName} read()`, error, {itemsIds})
      }
    }
  }
}
