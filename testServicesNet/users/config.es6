var path = require('path')

// var serviceConfigPath = path.join(sharedServicesConfigPath, 'users/')
// var eventsEmitConfigFile = path.join(serviceConfigPath, 'events.emit.json')
// var eventsListenConfigFile = path.join(serviceConfigPath, 'events.listen.json')
// var apiConfigFile = path.join(serviceConfigPath, 'api.json')
var serviceName = path.basename(__dirname)
module.exports = {
  serviceName,
  serviceMethodsFile: path.join(__dirname, './methods'),
  sharedServicePath: path.join(__dirname, '/../shared/services/', serviceName),
  sharedEntitiesPath: path.join(__dirname, '/../shared/entities/'),
  sharedServicesPath: path.join(__dirname, '/../shared/services/'),
  NODE_ENV: 'development',
  logPath: 'microserviceTest/logs'

}
