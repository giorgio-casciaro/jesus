var request = require('request')
const PACKAGE = 'channel.httpPublic.client'
const checkRequired = require('../utils').checkRequired
const EventEmitter = require('events')

const log = (msg, data) => { log('\n' + JSON.stringify(['LOG', 'JESUS CLIENT HTTP PUBLIC', msg, data])) }
const debug = (msg, data) => { if (process.env.debugJesus)log('\n' + JSON.stringify(['DEBUG', 'JESUS CLIENT HTTP PUBLIC', msg, data])) }
const error = (msg, data) => { log('\n' + JSON.stringify(['ERROR', 'JESUS CLIENT HTTP PUBLIC', msg, data])) }

module.exports = function getChannelHttpPublicClientPackage ({ methodCall, serviceName = 'unknow', serviceId = 'unknow' }) {
  try {
    return {
      send (listener, message, timeout = 120000, waitResponse = true, isStream = false) {
        return new Promise((resolve, reject) => {
          var newMeta = {}
          for (var metaK in message.meta)newMeta['app-meta-' + metaK] = message.meta[metaK]
          newMeta['app-meta-stream'] = isStream
          var httpUrl = 'http://' + listener.url.replace('http://', '').replace('//', '')
          // hl('send:', { listener, message, timeout, waitResponse, isStream })
          var callTimeout, call
          if (isStream) {
            call = request(
              { method: 'POST',
                preambleCRLF: true,
                postambleCRLF: true,
                body: message.data,
                headers: newMeta,
                json: true,
                uri: httpUrl + '/' + message.method
              })
            // stream serializer
            // log(call.listeners('data'))
            var rectifiedCall = new EventEmitter()
            call.on('data', (data) => {
              if (data.toString)data = data.toString().replace('data: ', '')
              rectifiedCall.emit('data', JSON.parse(data))
            })
            call.on('error', (data) => rectifiedCall.emit('error', data))
            call.on('end', (data) => rectifiedCall.emit('end', data))
            rectifiedCall.end = function () {
              hl('CALL END')
              call.end()
            }
            resolve(rectifiedCall)
          } else {
            call = request(
              { method: 'POST',
                preambleCRLF: true,
                postambleCRLF: true,
                body: message.data,
                headers: newMeta,
                json: true,
                uri: httpUrl + '/' + message.method
              },
              function (error, response, body) {
                // debug('Http request response', {error, body})
                if (callTimeout)clearTimeout(callTimeout)
                if (error) return reject(error)
                if (waitResponse)resolve(body)
              })
            callTimeout = setTimeout(function () {
              call.end()
              log('sendMessage timeout  to ' + listener.url, { message, serviceName, timeout })
              if (waitResponse)reject('Response problems: REQUEST TIMEOUT')
              else resolve(null)
            }, timeout)
          }
          if (!waitResponse)resolve(null)
        })
      }
    }
  } catch (error) {
    error(error, { methodCall})
    throw new Error('Error during getChannelGrpcClientPackage')
  }
}
