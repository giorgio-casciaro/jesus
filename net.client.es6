const PACKAGE = 'net.client'
const checkRequired = require('./utils').checkRequired
const R = require('ramda')
var preferedTransports = ['grpc', 'zeromq', 'http']
// var delayedMessages = global.JESUS_NET_CLIENT_delayedMessages = global.JESUS_NET_CLIENT_delayedMessages || {}

module.exports = function getNetClientPackage ({getConsole, serviceName = 'unknow', serviceId = 'unknow', getSharedConfig, config}) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  try {
    checkRequired({getSharedConfig, config})
    var getTrans = (transportName) => require(`./transports/${transportName}.client`)({getConsole, serviceName, serviceId})
    // var defaultEventEmit = require('./default.event.emit.json')

    const getServicesEventsConfigByEventName = async (event) => {
      var configs = await getSharedConfig('*', 'events.listen', serviceName)
      var eventConfig = []
      configs.forEach(config => {
        Object.keys(config).forEach(eventName => {
          if (event === eventName || eventName === '*')eventConfig.push({to: config.serviceName, method: config[eventName].method, event: config[eventName], eventName})
        })
      })
      return eventConfig
    }
    // function filterByTag (tags) {
    //   return (tagFilter) => {
    //     if (tagFilter)CONSOLE.debug(`filterByTag()`, tags.indexOf(tagFilter) + 1)
    //     return !tags || !tagFilter ? true : tags.indexOf(tagFilter) + 1
    //   }
    // }

    async function emit ({event, data = {}, meta = {}, timeout = 5000, singleResponse = true}) {
      meta.event = event
      var eventConfig = await getServicesEventsConfigByEventName(event)
      CONSOLE.debug('emit start ' + event, {singleResponse, event, data, meta, timeout, eventConfig})
      var responses = await Promise.all(eventConfig.map((rpcConfig) => rpc({to: rpcConfig.to, method: rpcConfig.method, data, meta, timeout, log: false })))
      responses = responses.filter((response) => response !== null)
      if (singleResponse)responses = responses[0] || null
      CONSOLE.debug('emit response' + event, {responses, event, eventConfig})
      return responses
    }

    async function rpc ({to, method, data = {}, meta = {}, timeout = 5000, }) {
      try {
        CONSOLE.debug('rpc() start', {to, method, data, meta, timeout })
        var senderNetConfig = await getSharedConfig(serviceName, 'net')
        var listenerNetConfig = await getSharedConfig(to, 'net')
        var listenerMethodsConfig = await getSharedConfig(to, 'methods')
        var listenerMethodConfig = listenerMethodsConfig[method]

        if (!listenerMethodsConfig[method]) throw new Error(method + ' is not valid (not defined in listener methods config)')

        var commonTransports = Object.keys(senderNetConfig.transports).filter((value) => 1 + Object.keys(listenerNetConfig.transports).indexOf(value))
        CONSOLE.debug('commonTransports', commonTransports, Object.keys(senderNetConfig.transports), Object.keys(listenerNetConfig.transports))
        if (!commonTransports.length) throw new Error(`service ${to} and service ${serviceName} have no common transports`)
        commonTransports.sort((a, b) => preferedTransports.indexOf(b) - preferedTransports.indexOf(a))// listenerMethod preferedTransports

        CONSOLE.debug('rpc commonTransports', {commonTransports, first: commonTransports[0]})
        var transport = getTrans(commonTransports[0])

        var sendTo = listenerNetConfig.transports[commonTransports[0]]
        var waitResponse = (listenerMethodConfig.responseType !== 'noResponse')
        var isStream = (listenerMethodConfig.responseType === 'stream')
        var meta = R.clone(meta)
        meta.reqOutTimestamp = Date.now()
        meta.from = serviceName
        meta.stream = isStream
        meta.to = to
        var message = {method, meta, data}

          // if streaming return eventEmiter con on data,on error,on end altrimenti risposta
        CONSOLE.log('=> CLIENT OUT STREAM', {to: sendTo, message, waitResponse})
        var response = await transport.send(sendTo, message, listenerMethodConfig.timeout, waitResponse, isStream)
        CONSOLE.log('=> CLIENT IN STREAM RESPONSE', {response})
          // if (singleResponse && response && response[0])response = response[0]
        CONSOLE.debug('rpc to ' + to + ' ' + method + ' corrid:' + meta.corrid, {response, sendTo, message, waitResponse})
        return response
      } catch (error) {
        CONSOLE.error(error, {to, method, data, meta, timeout})
        throw new Error('Error during rpc')
      }
    }
    return {
      rpc, emit
    }
  } catch (error) {
    CONSOLE.error(error, {config})
    throw new Error('Error during getNetClientPackage')
  }
}
