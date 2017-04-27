const PACKAGE = 'net.client'
const checkRequired = require('./utils').checkRequired
const R = require('ramda')
const co = require('co')
var preferedChannels = ['grpc', 'zeromq', 'http']
// var delayedMessages = global.JESUS_NET_CLIENT_delayedMessages = global.JESUS_NET_CLIENT_delayedMessages || {}
const getConsole = (serviceName, serviceId, pack) => require('./utils').getConsole({error: true, debug: true, log: true, warn: true}, serviceName, serviceId, pack)

module.exports = function getNetClientPackage ({serviceName = 'unknow', serviceId = 'unknow', getNetConfig, getEventsIn, getMethodsConfig, getRpcOut, getEventsOut}) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  try {
    checkRequired({getEventsIn, getMethodsConfig, getNetConfig, getRpcOut, getEventsOut}, PACKAGE)
    var getChannel = (channelName) => require(`./channels/${channelName}.client`)({getConsole, serviceName, serviceId})

    const getEventsFromServices = co.wrap(function*(event) {
      var servicesEventsIn = yield getEventsIn('*', serviceName)
      CONSOLE.debug('getEventsFromServices servicesEventsIn', servicesEventsIn, event)
      var eventConfig = []
      servicesEventsIn.forEach(config => {
        Object.keys(config.items).forEach(eventName => {
          if (event === eventName || eventName === '*')eventConfig.push({to: config.service, method: config.items[eventName].method, event: config.items[eventName], eventName})
        })
      })
      CONSOLE.debug('getEventsFromServices ', eventConfig)
      return eventConfig
    })

    const emit = co.wrap(function* (event, data = {}, meta = {}, timeout = 5000) {
      checkRequired({event}, PACKAGE)
      meta.event = event
      var eventsOutConfigAll = yield getEventsOut()
      if (!eventsOutConfigAll[event]) {
        CONSOLE.warn(`event ${event} not found in config EventsOut`, eventsOutConfigAll)
        return null
      }
      var eventOutConfig = eventsOutConfigAll[event]
      var eventsInConfig = yield getEventsFromServices(event)
      CONSOLE.debug('emit start ' + event, { eventsOutConfigAll, eventOutConfig, eventsInConfig, event, data, meta, timeout })
      checkRequired({eventOutConfig}, PACKAGE)
      var responses = yield Promise.all(eventsInConfig.map((rpcConfig) => rpcCall({ to: rpcConfig.to, method: rpcConfig.method, data, meta, timeout, log: false })))
      responses = responses.filter((response) => response !== null)
      if (!eventOutConfig.multipleResponse)responses = responses[0] || null
      CONSOLE.debug('emit response ' + event, {responses, event, eventsInConfig})
      return responses
    })
    const rpc = co.wrap(function*(rpcName, data = {}, meta = {}, timeout = 5000) {
      CONSOLE.debug('rpc() start', { rpcName, data, meta, timeout })
      checkRequired({rpcName}, PACKAGE)
      var rpcOutConfigAll = yield getRpcOut()
      var rpcOutConfig = rpcOutConfigAll[rpcName]

      checkRequired({rpcOutConfig}, PACKAGE)
      if (rpcOutConfig.timeout)timeout = rpcOutConfig.timeout
      CONSOLE.debug('rpc() start', { to: rpcOutConfig.to, method: rpcOutConfig.method, data, meta, timeout })
      var result = yield rpcCall({ to: rpcOutConfig.to, method: rpcOutConfig.method, data, meta, timeout })
      return result
    })
    const rpcCall = co.wrap(function*({ to, method, data = {}, meta = {}, timeout = 5000 }) {
      //
      try {

        checkRequired({to, method}, PACKAGE)
        var senderNetConfig = yield getNetConfig(serviceName)
        var listenerNetConfig = yield getNetConfig(to)
        var listenerMethodsConfig = yield getMethodsConfig(to)
        var listenerMethodConfig = listenerMethodsConfig[method]

        CONSOLE.debug('rpcCall() start', { to, method, data, meta, timeout, listenerNetConfig })
        CONSOLE.debug('rpcCall() start', to, listenerMethodsConfig)
        if (!listenerMethodsConfig[method]) throw new Error(method + ' is not valid (not defined in listener methods config)')

        var commonChannels = Object.keys(senderNetConfig.channels).filter((value) => 1 + Object.keys(listenerNetConfig.channels).indexOf(value))
        CONSOLE.debug('commonChannels', commonChannels, Object.keys(senderNetConfig.channels), Object.keys(listenerNetConfig.channels))
        if (!commonChannels.length) throw new Error(`service ${to} and service ${serviceName} have no common channels`)
        commonChannels.sort((a, b) => preferedChannels.indexOf(b) - preferedChannels.indexOf(a))// listenerMethod preferedChannels

        CONSOLE.debug('rpc commonChannels', {commonChannels, first: commonChannels[0]})
        var channel = getChannel(commonChannels[0])


        var sendTo = listenerNetConfig.channels[commonChannels[0]]
        var yieldResponse = (listenerMethodConfig.responseType !== 'noResponse')
        var isStream = (listenerMethodConfig.responseType === 'stream')
        meta = R.merge({
          reqOutTimestamp: Date.now(),
          from: serviceName,
          stream: isStream,
          to
        }, meta)
        var message = {method, meta, data}

          // if streaming return eventEmiter con on data,on error,on end altrimenti risposta
        CONSOLE.debug('=> CLIENT OUT ', {to: sendTo, message, yieldResponse})

        var response = yield channel.send(sendTo, message, listenerMethodConfig.timeout, yieldResponse, isStream)

        CONSOLE.debug('=> CLIENT IN  RESPONSE', {response})
          // if (singleResponse && response && response[0])response = response[0]
        CONSOLE.debug('rpc to ' + to + ' ' + method + ' corrid:' + meta.corrid, {response, sendTo, message, yieldResponse})
        return response
      } catch (error) {
        CONSOLE.error(error, {to, method, data, meta, timeout})
        throw new Error('Error during rpc')
      }
    })
    return {
      rpc, emit
    }
  } catch (error) {
    CONSOLE.error(error, {serviceName, serviceId, getNetConfig, getEventsIn, getMethodsConfig, getRpcOut, getEventsOut})
    throw new Error('Error during getNetClientPackage')
  }
}
