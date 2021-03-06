var request = require('request')
const PACKAGE = 'channel.http.client'
const checkRequired = require('../utils').checkRequired
const EventEmitter = require('events')

module.exports = function getChannelHttpClientPackage ({  methodCall, serviceName = 'unknow', serviceId = 'unknow' }) {
  

  try {
    
    return {
      send (listener, message, timeout = 120000, waitResponse = true, isStream = false) {
        return new Promise((resolve, reject) => {
          var httpUrl = 'http://unix:' + listener.file.replace(':', '') + ':'
          console.debug('send:', { httpUrl, listener, message, timeout, waitResponse, isStream })
          var callTimeout, call
          if (isStream) {
            call = request(
              { method: 'POST',
                preambleCRLF: true,
                postambleCRLF: true,
                body: message,
                json: true,
                uri: httpUrl + '/_httpMessageStream'
              })
            // stream serializer
            // console.log(call.listeners('data'))
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
                body: message,
                json: true,
                uri: httpUrl + '/_httpMessage'
              },
              function (error, response, body) {
                console.debug('Http request response', {error, body})
                if (callTimeout)clearTimeout(callTimeout)
                if (error) return reject(error)
                if (waitResponse)resolve(body)
              })
            callTimeout = setTimeout(() => {
              call.end()
              console.warn('sendMessage timeout  to ' + listener.file, { message, serviceName, timeout })
              if (waitResponse)reject('Response problems: REQUEST TIMEOUT')
              else resolve(null)
            }, timeout)
          }
          if (!waitResponse)resolve(null)
        })
      }
    }
  } catch (error) {
    console.error(error, { methodCall})
    throw new Error('Error during getChannelGrpcClientPackage')
  }
}
