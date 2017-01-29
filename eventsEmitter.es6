var R = require('ramda')
function debug () {
  console.log('\u001b[1;33m' +
    '<Jesus Events Emitter>' +
    '\u001b[0m')
  console.log.apply(console, arguments)
}

function emitNetEvent (event, eventData, eventOptions) {
  return new Promise(async function emitPromise (resolve, reject) {
    resolve([])
  })
}

function emit (allLocalEvents, eventName, eventData, eventEmitOptions = {}) {
  return new Promise(async function emitPromise (resolve, reject) {
    eventEmitOptions = R.merge(eventEmitOptions, {
      netEmitted: false
    })
    try {
      var allResponses =[];
      // NET EVENTS
      if(!eventEmitOptions.netEmitted){
        var emitNetEventResponses = await emitNetEvent(eventName, eventData, eventEmitOptions)
        allResponses = allResponses.concat(emitNetEventResponses)
      }
      // LOCAL EVENTS
      var localEventArray = allLocalEvents[eventName]
      var localEventArrayPromises = R.map((singleEvent) => {
        // debug('Jesus Events Emitter singleEvent.eventPromise', eventData, singleEvent.eventOptions, singleEvent.eventPromise)
        return singleEvent.eventPromise(eventData, eventEmitOptions, singleEvent.eventRegistrationOptions)
      }, localEventArray)
      var emitLocalEventResponses = await Promise.all(localEventArrayPromises)

      allResponses = allResponses.concat(emitLocalEventResponses)
      resolve(allResponses)
    } catch (error) {
      reject(error)
    }
  }
  )
}
var curriedEmit = R.curryN(3, emit)

function register (allLocalEvents, eventName, eventPromise, eventRegistrationOptions) {
  eventRegistrationOptions = R.merge(eventRegistrationOptions, {
    localEvent: false
  })
  if (!allLocalEvents[eventName])allLocalEvents[eventName] = []
  allLocalEvents[eventName].push({eventName, eventPromise, eventRegistrationOptions})
  // debug('Jesus Events Emitter Register', allLocalEvents)
}
var curriedRegister = R.curryN(3, register)

module.exports = function getEventsEmitterPackage () {
  var allLocalEvents = {}
  return {
    on: curriedRegister(allLocalEvents),
    emit: curriedEmit(allLocalEvents)
  }
}
