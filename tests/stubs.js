module.exports = function (sharedConfig, Methods, getConsole) {
  var getMethods = (service, exclude) => Methods

  var getSharedConfig = (field = 'net', service = '*', exclude = '') => {
    console.log('sharedConfig', sharedConfig[service])
    if (service === '*') return Object.keys(sharedConfig).filter((key) => key !== exclude).map((key) => { return {items: sharedConfig[key][field], service: key} })
    else return sharedConfig[service][field]
  }
  // getMethods: () => require(path.join(__dirname, './methods'))(CONSOLE, netClient),
  // getMethodsConfig: (service, exclude) => schemaClient.get('methods', service),
  // getNetConfig: (service, exclude) => schemaClient.get('net', service, exclude),
  // getEventsIn: (service, exclude) => schemaClient.get('eventsIn', service, exclude),
  // getEventsOut: (service, exclude) => schemaClient.get('eventsOut', service, exclude),
  // getRpcOut: (service, exclude) => schemaClient.get('rpcOut', service, exclude)

  function getServer (serviceName, serviceId) {
    var getMethodsConfig = async (service, exclude) => getSharedConfig('methods', service || serviceName, exclude)
    var getNetConfig = async (service, exclude) => getSharedConfig('net', service || serviceName, exclude)
    var getEventsIn = async (service, exclude) => getSharedConfig('eventsIn', service || serviceName, exclude)
    var getEventsOut = async (service, exclude) => getSharedConfig('eventsOut', service || serviceName, exclude)
    var getRpcOut = async (service, exclude) => getSharedConfig('rpcOut', service || serviceName, exclude)
    return require('../net.server')({getConsole, serviceName, serviceId, getMethods, getMethodsConfig, getNetConfig})
  }

  function getClient (serviceName, serviceId) {
    var getMethodsConfig = async (service, exclude) => getSharedConfig('methods', service || serviceName, exclude)
    var getNetConfig = async (service, exclude) => getSharedConfig('net', service || serviceName, exclude)
    var getEventsIn = async (service, exclude) => getSharedConfig('eventsIn', service || serviceName, exclude)
    var getEventsOut = async (service, exclude) => getSharedConfig('eventsOut', service || serviceName, exclude)
    var getRpcOut = async (service, exclude) => getSharedConfig('rpcOut', service || serviceName, exclude)
    return require('../net.client')({getConsole, serviceName, serviceId, getNetConfig, getEventsIn, getEventsOut, getMethodsConfig, getRpcOut})
  }

  return {
    getServer, getClient
  }
}
