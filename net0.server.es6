var R = require('ramda')
const uuidV4 = require('uuid/v4')
var ajv = require('ajv')({allErrors: true})
const PACKAGE = 'net.server'
const checkRequired = require('./jesus').checkRequired

module.exports = function getNetServerPackage ({config, getConsole, serviceName = 'unknow', serviceId = 'unknow', getMethods, getSharedConfig}) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)
  checkRequired({config, getMethods, getSharedConfig, getConsole})
  try {
  // var defaultEventListen = require('./default.event.listen.json')
    var validate = (methodConfig, methodName, data, schemaField = 'requestSchema') => {
      CONSOLE.debug('validate ', {methodConfig, methodName, data, schemaField })
      if (!methodConfig[schemaField]) throw new Error(schemaField + ' not defined in methods.json ' + methodName)
      var validate = ajv.compile(methodConfig[schemaField])
      var valid = validate(data)
      if (!valid) {
        CONSOLE.error('validation errors ', {errors: validate.errors, methodName, data, schemaField})
        throw new Error('validation error ', {errors: validate.errors})
      } else return data
    }
    var getTrans = (transportName) => require(`./transports/${transportName}.server`)({getSharedConfig, getConsole, methodCall, serviceName, serviceId, config: config.transports[transportName]})
    var forEachTransport = (func) => Object.keys(config.transports).forEach((transportName) => func(getTrans(transportName)))

    config = R.merge({
      transports: {
        'grpc': {
          'url': 'localhost:8080',
          'public': true
        }
      }
    }, config)
    CONSOLE.debug('config ', config)
    // ogni method call può avere più dati anche dauserid e requestid diversi
    var methodCall = async function methodCall (message, getStream, publicApi = true, multiResponse = false) {
      try {
        var singleCall = async (callData) => {
          try {
            CONSOLE.debug('singleCall', callData)
            var corrid = callData.r || uuidV4()
            var userid = callData.u || 'UNKNOW'
            var data = callData.d || {}
            var meta = { corrid, userid, methodName, from, timestamp: Date.now() }
            CONSOLE.debug('singleCall data ', {data, meta, getStream, publicApi})
            var response
            validate(methodConfig, methodName, data, 'requestSchema')
            if (methodConfig.responseType === 'response') {
              response = await method(data, meta, getStream || null)
              validate(methodConfig, methodName, response, 'responseSchema')
              CONSOLE.debug('singleCall response ' + methodName, {response})
              return response
            } else {
              method(data, meta, getStream || null)
              return true
            }
          } catch (error) {
            CONSOLE.error(error)
            throw new Error('message error ' + methodName)
          }
        }

        var from = message.f
        var methodName = message.m
        var callDataArray = message.d

        var serviceMethodsConfig = await getSharedConfig(serviceName, 'methods')
        var methods = getMethods()
        CONSOLE.log('=> SERVER IN', {message})
        CONSOLE.debug('methodCall', {message, getStream, publicApi, serviceMethodsConfig}, serviceName, getSharedConfig)

        if (!serviceMethodsConfig[methodName]) throw new Error(methodName + ' is not valid (not defined in methods config)')
        if (!serviceMethodsConfig[methodName].public && publicApi) throw new Error(methodName + ' is not public')
        if (!methods[methodName]) throw new Error(methodName + ' is not valid (not defined service methods js file)')

        var method = methods[methodName]
        var methodConfig = serviceMethodsConfig[methodName]

        var response
        if (methodConfig.responseType === 'noResponse') {
          // NORESPONSE CAN have multiple CALL PER MESSAGE
          callDataArray.map(singleCall)
          response = null
        } else if (methodConfig.responseType === 'aknowlegment') {
          await Promise.all(callDataArray.map(singleCall))
          response = null
        } else if (methodConfig.responseType === 'response') {
          response = await Promise.all(callDataArray.map(singleCall))
          if (!multiResponse)response = response[0]
        } else {
          // STREAM CAN have ONLY one CALL PER MESSAGE
          response = await singleCall(callDataArray[0])
        }

        CONSOLE.log('SERVER OUT => ', {response, responseType: methodConfig.responseType})
        CONSOLE.debug('MAIN RESPONSE ' + methodName, response)
        return response
      } catch (error) {
        CONSOLE.error(error, {methodName})
        throw new Error('Error during methodCall')
      }
    }
    return {
      start () {
        CONSOLE.log('START TRANSPORTS SERVERS ', {transports: config.transports})
        forEachTransport((transport) => transport.start())
        var server = net.createServer((socket) => {
          socket.end('goodbye\n')
        }).on('error', (err) => {
          throw err
        })
      },
      stop () {
        CONSOLE.log('STOP TRANSPORTS SERVERS ', {transports: config.transports})
        forEachTransport((transport) => transport.stop())
      },
      restart () {
        CONSOLE.log('RESTART TRANSPORTS SERVERS ', {transports: config.transports})
        forEachTransport((transport) => transport.restart())
      }
    }
  } catch (error) {
    CONSOLE.error(error, {methodName})
    throw new Error('Error during getNetServerPackage')
  }
}
