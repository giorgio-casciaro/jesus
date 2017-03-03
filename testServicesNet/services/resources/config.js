var path = require('path')

var serviceName = path.basename(__dirname)
module.exports = {
  serviceName: serviceName,
  sharedServicesPath: path.join(__dirname, '/../../shared/services/'),
  storage: {path: path.join(__dirname, '../../fileDb')},
  NODE_ENV: 'development',
  console: {debug: true, log: true, error: true, warn: true}
}
