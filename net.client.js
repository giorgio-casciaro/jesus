const PACKAGE = 'net.client'
const uuidV4 = require('uuid/v4')
const checkRequired = require('./utils').checkRequired
var preferedChannels = ['grpc', 'zeromq', 'http']
process.env.debugJesus = true
// var delayedMessages = global.JESUS_NET_CLIENT_delayedMessages = global.JESUS_NET_CLIENT_delayedMessages || {}
const log = (msg, data) => { console.log('\n' + JSON.stringify(['LOG', 'JESUS CLIENT', msg, data])) }
const debug = (msg, data) => { if (process.env.debugJesus) console.log('\n' + JSON.stringify(['DEBUG', 'JESUS CLIENT', msg, data])) }
const error = (msg, data) => { console.log('\n' + JSON.stringify(['ERROR', 'JESUS CLIENT', msg, data])); console.error(data) }

module.exports = function getNetClientPackage ({serviceName = 'unknow', serviceId = 'unknow', getNetConfig, getEventsIn, getMethodsConfig, getRpcOut, getEventsOut}) {
  var testPuppets = {}
  try {
    checkRequired({getEventsIn, getMethodsConfig, getNetConfig, getRpcOut, getEventsOut}, PACKAGE)
    var getChannel = (channelName) => require(`./channels/${channelName}.client`)({serviceName, serviceId})

    const getEventsFromServices = async (event, eventOutConfig) => {
      var servicesEventsIn = await getEventsIn('*')
      debug('getEventsFromServices servicesEventsIn', servicesEventsIn, event)
      var eventConfig = []
      servicesEventsIn.forEach(config => {
        if (!config || !config.items) return false
        Object.keys(config.items).forEach(eventName => {
          if (event === eventName)eventConfig.push({to: config.service, method: config.items[eventName].method, event: config.items[eventName], eventName})
        })
      })
      debug('getEventsFromServices ', eventConfig)
      return eventConfig
    }
    const getEventOutConfig = async (event) => {
      var eventsOutConfigAll = await getEventsOut()
      if (!eventsOutConfigAll[event]) {
        // log(`event ${event} not found in config EventsOut`, eventsOutConfigAll)
        throw new Error(`event ${event} not found in config EventsOut`)
      }
      return eventsOutConfigAll[event]
    }

    async function emit (event, data = {}, metaRaw = {}, timeout = false, channel = false) {
      try {
        checkRequired({event}, PACKAGE)
        var meta = Object.assign({}, metaRaw, { emit: event })
        var eventOutConfig = await getEventOutConfig(event)
        var eventsInConfig = await getEventsFromServices(event, eventOutConfig)
        debug('emit start ' + event, { eventOutConfig, eventsInConfig })
        var responses = await Promise.all(eventsInConfig.map((rpcConfig) => rpcCall({ to: rpcConfig.to, method: rpcConfig.method, data, meta, timeout, log: false, channel })))
        responses = responses.filter((response) => response !== null)
        if (!eventOutConfig.multipleResponse)responses = responses[0] || null
        debug('emit response ' + event, {responses, eventsInConfig})
        return responses
      } catch (err) {
        error('RPC error -->', {err})
        return {error: 'emit error -->' + err}
      }
    }

    function testLocalMethod (method, data = {}, meta = {}, timeout = false, channel = false) {
      return rpcCall({to: serviceName, method, data, meta, timeout, channel})
    }

    async function rpc (rpcName, data = {}, meta = {}, timeout = false, channel = false) {
      checkRequired({rpcName}, PACKAGE)
      var rpcOutConfigAll = await getRpcOut()
      var rpcOutConfig = rpcOutConfigAll[rpcName]
      debug('rpc() start', { rpcName, rpcOutConfig, rpcOutConfigAll })
      checkRequired({rpcOutConfig}, PACKAGE)
      if (rpcOutConfig.timeout)timeout = rpcOutConfig.timeout
      return await rpcCall({to: rpcOutConfig.to, method: rpcOutConfig.method, data, meta, timeout, channel})
    }

    function findChannel (from, to, senderNetConfig, listenerNetConfig) {
      var commonChannels = Object.keys(senderNetConfig.channels).filter((value) => 1 + Object.keys(listenerNetConfig.channels).indexOf(value))
      debug('commonChannels', commonChannels, Object.keys(senderNetConfig.channels), Object.keys(listenerNetConfig.channels))
      if (!commonChannels.length) throw new Error(`service ${to} and service ${from} have no common channels`)
      commonChannels.sort((a, b) => preferedChannels.indexOf(b) - preferedChannels.indexOf(a))// listenerMethod preferedChannels
      debug('rpc commonChannels', {commonChannels, first: commonChannels[0]})
      return commonChannels[0] || false
    }

    async function getMethodConfig (service, method) {
      var listenerMethodsConfig = await getMethodsConfig(service)
      log('listenerMethodsConfig', { service, method, listenerMethodsConfig })
      if (!listenerMethodsConfig[method]) throw new Error(method + ' is not valid method(not defined in listener methods config)')
      return listenerMethodsConfig[method]
    }

    function getMessageMeta (metaRaw = {}, channel, stream = false, to) {
      return Object.assign({}, metaRaw, {
        corrid: metaRaw.corrid || uuidV4(),
        // userid: metaRaw.userid || 'UNKNOW',
        from: serviceName,
        timestamp: Date.now(),
        reqtype: 'out',
        channel: channel || 'UNKNOW',
        stream: stream,
        to: to
      })
    }

    async function rpcCall ({to, method, data = {}, meta = {}, timeout = false, channel = false }) {
      try {
        log('rpcCall() start', { to, method, data, meta, timeout, channel })
        checkRequired({to, method}, PACKAGE)

        debug('rpcCall() testPuppets', { name: to + '_' + method, keys: Object.keys(testPuppets) })
        if (testPuppets[to + '_' + method]) return testPuppets[to + '_' + method]({ to, method, data, meta, timeout, channel })

        // CONFIG
        var listenerMethodConfig = await getMethodConfig(to, method)
        var listenerNetConfig = await getNetConfig(to)

        // GET CHANNEL OBJ
        //  hl('rpcCall', serviceName, channel)
        if (!channel) {
          var senderNetConfig = await getNetConfig(serviceName)
          channel = findChannel(serviceName, to, senderNetConfig, listenerNetConfig)
        }
        var channelObj = getChannel(channel)
        // hl('rpcCall2', serviceName, senderNetConfig, listenerNetConfig, channel)

        // SEND
        var message = { method, meta: getMessageMeta(meta, channel, isStream, to), data }
        var sendTo = listenerNetConfig.channels[channel]
        var waitResponse = (listenerMethodConfig.responseType !== 'noResponse')
        var isStream = (listenerMethodConfig.responseType === 'stream')

        timeout = timeout || listenerMethodConfig.timeout || 120000

        log('=> CLIENT OUT ', {channel, sendTo, message, timeout, waitResponse, isStream})
        var response = await channelObj.send(sendTo, message, timeout, waitResponse, isStream)
        log('=> CLIENT IN  RESPONSE', {message, response})
        return response
      } catch (err) {
        error('RPC error -->', err)
        return {error: 'RPC error -->' + err}
      }
    }
    return {
      rpc, emit, testLocalMethod, rpcCall, testPuppets
    }
  } catch (err) {
    error(err.toString(), {serviceName, serviceId, getNetConfig, getEventsIn, getMethodsConfig, getRpcOut, getEventsOut})
    throw new Error('Error during getNetClientPackage')
  }
}
