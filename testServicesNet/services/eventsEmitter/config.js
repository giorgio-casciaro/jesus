var path = require('path')

var serviceName = path.basename(__dirname)
module.exports = {
  serviceName: serviceName,
  sharedServicesPath: path.join(__dirname, '/../../shared/services/'),
  NODE_ENV: 'development',
  logPath: 'microserviceTest/logs'

}
