var R = require('ramda')
const uuidV4 = require('uuid/v4')
const PACKAGE = 'net.server'
const checkRequired = require('./utils').checkRequired

const log = (msg, data) => { console.log('\n' + JSON.stringify(['LOG', 'JESUS SERVER', msg, data])) }
const debug = (msg, data) => { if (process.env.debugJesus) console.log('\n' + JSON.stringify(['DEBUG', 'JESUS SERVER', msg, data])) }
const error = (msg, data) => { console.log('\n' + JSON.stringify(['ERROR', 'JESUS SERVER', msg, data])); console.error(data) }

var Ajv = require('ajv')
var ajvNoRemoveAdditional = new Ajv({ coerceTypes: true, allErrors: true, removeAdditional: false })
var ajvRemoveAdditional = new Ajv({ coerceTypes: true, allErrors: true, removeAdditional: true })
var validateMsg = ajvRemoveAdditional.compile(require('./schemas/message.schema.json'))

class ErrorWithData extends Error {
  constructor (message, data) {
    super(message)
    Object.defineProperty(this, 'data', { value: data })
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = function getNetServerPackage ({ serviceName = 'unknow', serviceId = 'unknow', getMethods, getMethodsConfig, getNetConfig}) {
  try {
    checkRequired({getMethods, getMethodsConfig, getNetConfig}, PACKAGE)
    var config
    var validateMessage = (data) => {
      if (!validateMsg(data)) {
        error('MESSAGE IS NOT VALID ', {errors: validateMsg.errors})
        throw new Error('MESSAGE IS NOT VALID', {errors: validateMsg.errors})
      } else return data
    }
    var validateWithSchema = (methodConfig, methodName, data, schemaField = 'requestSchema') => {
      if (methodConfig[schemaField] === false) return data
      if (!methodConfig[schemaField]) throw new Error(schemaField + ' not defined in methods.json ' + methodName)
      var schema = Object.assign({
        'type': 'object',
        'additionalProperties': false
      }, methodConfig[schemaField])
      var ajv = ajvNoRemoveAdditional
//      if (!schema.additionalProperties)ajv = ajvRemoveAdditional
      var validate = ajv.compile(schema)
      var valid = validate(data)
      if (!valid) {
        log('Validation Errors', {data, error: validate.errors})
        throw new ErrorWithData('validation errors', {'type': 'schemaValidation', schemaField, 'errors': validate.errors})
      } else return data
    }
    function getMethodMeta (metaRaw = {}, channel) {
      return Object.assign({}, metaRaw, {
        corrid: metaRaw.corrid || uuidV4(),
        // userid: metaRaw.userid || 'UNKNOW',
        from: metaRaw.from || 'UNKNOW',
        reqintime: metaRaw.timestamp || 'UNKNOW',
        timestamp: Date.now(),
        reqtype: 'out',
        channel: channel || metaRaw.channel || 'UNKNOW',
        stream: metaRaw.stream || false
      })
    }
    async function getMethod (methodName) {
      var methods = await getMethods()
      if (!methods[methodName]) throw new Error(methodName + ' is not valid (not defined service methods js file)')
      return methods[methodName]
    }
    async function getMethodConfig (methodName, publicApi = false, service = serviceName) {
      var serviceMethodsConfig = await getMethodsConfig(service)
      if (!serviceMethodsConfig[methodName]) throw new Error(methodName + ' is not valid (not defined in methods config)')
      if (!serviceMethodsConfig[methodName].public && publicApi) throw new Error(methodName + ' is not public')
      return serviceMethodsConfig[methodName]
    }

    var getChannel = (channelName) => require(`./channels/${channelName}.server`)({ methodCall, serviceName, serviceId, config: config.channels[channelName], getMethodsConfig })
    var forEachChannel = (func) => Object.keys(config.channels).forEach((channelName) => func(getChannel(channelName)))

    var methodCall = async function methodCall (message, getStream, publicApi = true, channel = 'UNKNOW') {
      try {
        log('=> SERVER IN', {message})
        validateMessage(message)

        // CONFIG
        var methodName = message.method
        var meta = getMethodMeta(message.meta, channel)
        var data = message.data || {}
        var method = await getMethod(methodName)
        var methodConfig = await getMethodConfig(methodName, publicApi)

        // VALIDATION
        data = validateWithSchema(methodConfig, methodName, data, 'requestSchema')
        // CALL
        var response

        if (methodConfig.responseType === 'noResponse') {
          method(data, meta, getStream || null)
          response = null
        } else if (methodConfig.responseType === 'aknowlegment') {
          method(data, meta, getStream || null)
          response = {'aknowlegment': 1}
        } else if (methodConfig.responseType === 'response') {
          response = await method(data, meta, getStream || null)
          response = validateWithSchema(methodConfig, methodName, response, 'responseSchema')
        } else {
          response = await method(data, meta, getStream || null)
        }

        log('SERVER OUT => ', {responseType: methodConfig.responseType, response})
        return response
      } catch (err) {
        error('SERVER OUT => !ERROR : ', err)
        log('SERVER OUT => !ERROR : ', {'type': 'method', method: methodName, 'error': err.message, 'data': err.data})
        return {__RESULT_TYPE__: 'error', method: methodName, 'error': err.message, 'data': err.data}
      }
    }
    return {
      async start () {
        config = await getNetConfig(serviceName)
        log('START CHANNELS SERVERS ', serviceName, config)
        checkRequired({channels: config.channels}, PACKAGE)
        forEachChannel((channel) => channel.start())
      },
      stop () {
        debug('STOP CHANNELS SERVERS ', {channels: config.channels})
        forEachChannel((channel) => channel.stop())
      },
      restart () {
        debug('RESTART CHANNELS SERVERS ', {channels: config.channels})
        forEachChannel((channel) => channel.restart())
      }
    }
  } catch (error) {
    error(error)
    throw new Error('Error during getNetServerPackage')
  }
}
