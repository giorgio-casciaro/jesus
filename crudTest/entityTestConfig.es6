var R = require('ramda')
var path = require('path')
module.exports = async function getEntityTestConfig (SERVICE,DI) {

  return {
    storageType: () => SERVICE.config.mainStorage.type,
    storageConfig: () => SERVICE.config.mainStorage.config,
    mutationsPath: () => path.join(__dirname, 'entityTest/mutations'),
    viewsSnapshotsMaxMutations: () => 10,
    validationSchema: () => {
      try {
        return require('./entityTest/entity.schema.json')
      } catch (error) {
        DI.throwError('entityTestConfig validationSchema() ', error)
      }
    },
    validationType: () => 'jsonSchema'
  }
}
