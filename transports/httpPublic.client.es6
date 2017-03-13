var request = require('request')
const PACKAGE = 'transport.httpPublic.client'
const checkRequired = require('../jesus').checkRequired
const EventEmitter = require('events')

module.exports = function getTransportHttpPublicClientPackage ({ getConsole, methodCall, serviceName = 'unknow', serviceId = 'unknow' }) {
  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE)

  try {
    checkRequired({ getConsole})
    return {
      send (listener, message, timeout = 120000, waitResponse = true, isStream = false) {
        return new Promise((resolve, reject) => {
          var httpUrl = 'http://' + listener.url.replace('http://', '').replace('//', '')
          CONSOLE.debug('send:', JSON.stringify({ listener, message, timeout, waitResponse, isStream }))
          var callTimeout, call
          if (isStream) {
            call = request(
              { method: 'POST',
                preambleCRLF: true,
                postambleCRLF: true,
                body: message.d[0].d,
                headers: {
                  stream: true,
                  from: message.f,
                  corrid: message.d[0].r,
                  userid: message.d[0].u
                },
                json: true,
                uri: httpUrl + '/' + message.m
              })
            // stream serializer
            console.log(call.listeners('data'))
            var rectifiedCall = new EventEmitter()
            call.on('data', (data) => {
              rectifiedCall.emit('data', JSON.parse(data))
            })
            call.on('error', (data) => rectifiedCall.emit('error', data))
            call.on('end', (data) => rectifiedCall.emit('end', data))
            resolve(rectifiedCall)
          } else {
            call = request(
              { method: 'POST',
                preambleCRLF: true,
                postambleCRLF: true,
                body: message.d[0].d,
                headers: {
                  from: message.f||false,
                  corrid: message.d[0].r||false,
                  userid: message.d[0].u||false
                },
                json: true,
                uri: httpUrl + '/' + message.m
              },
              function (error, response, body) {
                CONSOLE.debug('Http request response', {error, response, body})
                if (callTimeout)clearTimeout(callTimeout)
                if (error) return reject(error)
                if (waitResponse)resolve(body)
              })
            callTimeout = setTimeout(() => {
              call.end()
              CONSOLE.warn('sendMessage timeout  to ' + listener.url, { message, serviceName, timeout })
              if (waitResponse)reject('Response problems: REQUEST TIMEOUT')
              else resolve(null)
            }, timeout)
          }
          if (!waitResponse)resolve(null)
        })
      }
    }
  } catch (error) {
    CONSOLE.error(error, {getConsole, methodCall})
    throw new Error('Error during getTransportGrpcClientPackage')
  }
}
