var path = require('path')

var serviceName = path.basename(__dirname)
module.exports = {
  serviceName: serviceName,
  serviceMethodsFile: path.join(__dirname, './methods'),
  sharedServicePath: path.join(__dirname, '/../../shared/services/', serviceName),
  sharedEntitiesPath: path.join(__dirname, '/../../shared/entities/'),
  sharedServicesPath: path.join(__dirname, '/../../shared/services/'),
  NODE_ENV: 'development',
  logPath: 'microserviceTest/logs'

}
