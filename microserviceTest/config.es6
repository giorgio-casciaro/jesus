var R = require('ramda')
var path = require('path')
const uuidV4 = require('uuid/v4')

var mainStorage = require('../storage.inmemory')
var mainStorageType = 'inmemory'
var mainStorageConfig = {
  path: path.join(__dirname, 'fileDb')
}
module.exports = {
  instanceId: uuidV4(),
  name: 'testMicroservice',
  tags: 'public permissions',
  httpPort: 8080,
  httpPrivatePort: 8081,
  net: {
    netRegistry: require('./shared/netRegistry.json'),
    url: '0.0.0.0:8082'
  },
  NODE_ENV: 'development',
  logPath: 'microserviceTest/logs',
  debugActive: true,
  'autorizationsView': {
    filterData: R.pick(['_id', 'name']), // function per filtrare i fields degli item, tiene solo quelli interessanti per la view
    storage: mainStorage,
    storageConfig: mainStorageConfig,
    storageCollection: () => 'autorizationsView'
  },
  'UserPermission': {
    entityName: 'UserPermission',
    schema: path.join(__dirname, '/shared/entities/Permission/entity.schema.json'),
    validationsPath: path.join(__dirname, '/shared/entities/Permission/'),
    storage: mainStorage,
    storageConfig: mainStorageConfig,
    storageCollection: () => 'UserPermissions'
    // permissionsExtra: () => [
    //   {entity: '*', action: '*', type: 'roleBased', permit: true, force: true, priority: 0, roleBasedArgs: {roleId: 'admin'}},
    //   {entity: '*', action: '*', type: 'userBased', permit: true, force: true, priority: 10, userBasedArgs: {userId: 'admin'}},
    //   {entity: '*', action: '*', type: 'contextBased', permit: true, force: true, priority: 100, contextBasedArgs: {ip: '127.0.0.1'}}
    // ]
  },
  'User': {
    entityName: 'User',
    schema: path.join(__dirname, '/shared/entities/User/entity.schema.json'),
    // mutations: {
    //   create: {
    //     validationSchema: () => require('./shared/entities/User/create.schema.json'),
    //     validate: require("../validate.jsonSchema"),
    //   },
    //   update: {
    //     validationSchema: () => require('./shared/entities/User/update.schema.json'),
    //     validate: require("../validate.jsonSchema"),
    //   }
    // },
    mutationsStorage: {
      storage: mainStorage,
      storageConfig: mainStorageConfig,
      storageCollection: () => 'UserMutations'
    },
    mutationsPath: () => path.join(__dirname, './shared/entities/User/mutations'),
    viewsStorage: {
      storage: mainStorage,
      storageConfig: mainStorageConfig,
      storageCollection: () => 'UserViewsStorage'
    },
    viewsSnapshotsStorage: {
      storage: mainStorage,
      storageConfig: mainStorageConfig,
      storageCollection: () => 'UserViewsSnapshots'
    },
    viewsSnapshotsMaxMutations: () => 10
  }
}
