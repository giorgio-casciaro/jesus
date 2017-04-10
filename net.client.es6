const PACKAGE = 'net.client'
const checkRequired = require('./utils').checkRequired
const R = require('ramda')
var preferedChannels = ['grpc', 'zeromq', 'http']
// var delayedMessages = global.JESUS_NET_CLIENT_delayedMessages = global.JESUS_NET_CLIENT_delayedMessages || {}

module.exports = function getNetClientPackage ({getConsole, serviceName = 'unknow', serviceId = 'unknow', getNetConfig, getEventsIn, getMethodsConfig}) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  try {
    checkRequired({getEventsIn, getMethodsConfig, getNetConfig})
    var getChannel = (channelName) => require(`./channels/${channelName}.client`)({getConsole, serviceName, serviceId})

    const getEventsInConfig = async (event) => {
      var servicesEventsIn = await getEventsIn('*', serviceName)
      var eventConfig = []
      servicesEventsIn.forEach(config => {
        Object.keys(config.items).forEach(eventName => {
          if (event === eventName || eventName === '*')eventConfig.push({to: config.service, method: config.items[eventName].method, event: config.items[eventName], eventName})
        })
      })
      CONSOLE.debug('getEventsInConfig ', eventConfig)
      return eventConfig
    }

    async function emit ({event, data = {}, meta = {}, timeout = 5000, singleResponse = true}) {
      meta.event = event
      var eventConfig = await getEventsInConfig(event)
      CONSOLE.debug('emit start ' + event, {singleResponse, event, data, meta, timeout, eventConfig})
      var responses = await Promise.all(eventConfig.map((rpcConfig) => rpc({ to: rpcConfig.to, method: rpcConfig.method, data, meta, timeout, log: false })))
      responses = responses.filter((response) => response !== null)
      if (singleResponse)responses = responses[0] || null
      CONSOLE.debug('emit response' + event, {responses, event, eventConfig})
      return responses
    }

    async function rpc ({to, method, data = {}, meta = {}, timeout = 5000 }) {
      try {
        CONSOLE.debug('rpc() start', { to, method, data, meta, timeout })
        checkRequired({to, method})
        var senderNetConfig = await getNetConfig(serviceName)
        var listenerNetConfig = await getNetConfig(to)
        var listenerMethodsConfig = await getMethodsConfig(to)
        var listenerMethodConfig = listenerMethodsConfig[method]

        if (!listenerMethodsConfig[method]) throw new Error(method + ' is not valid (not defined in listener methods config)')

        var commonChannels = Object.keys(senderNetConfig.channels).filter((value) => 1 + Object.keys(listenerNetConfig.channels).indexOf(value))
        CONSOLE.debug('commonChannels', commonChannels, Object.keys(senderNetConfig.channels), Object.keys(listenerNetConfig.channels))
        if (!commonChannels.length) throw new Error(`service ${to} and service ${serviceName} have no common channels`)
        commonChannels.sort((a, b) => preferedChannels.indexOf(b) - preferedChannels.indexOf(a))// listenerMethod preferedChannels

        CONSOLE.debug('rpc commonChannels', {commonChannels, first: commonChannels[0]})
        var channel = getChannel(commonChannels[0])

        var sendTo = listenerNetConfig.channels[commonChannels[0]]
        var waitResponse = (listenerMethodConfig.responseType !== 'noResponse')
        var isStream = (listenerMethodConfig.responseType === 'stream')
        meta = R.merge({
          reqOutTimestamp: Date.now(),
          from: serviceName,
          stream: isStream,
          to
        }, meta)
        var message = {method, meta, data}

          // if streaming return eventEmiter con on data,on error,on end altrimenti risposta
        CONSOLE.debug('=> CLIENT OUT STREAM', {to: sendTo, message, waitResponse})
        var response = await channel.send(sendTo, message, listenerMethodConfig.timeout, waitResponse, isStream)
        CONSOLE.debug('=> CLIENT IN STREAM RESPONSE', {response})
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
