'use strict';

var R = require('ramda');
function debug() {
  console.log('\x1B[1;33m' + '<Jesus Events Emitter>' + '\x1B[0m');
  console.log.apply(console, arguments);
}

function emitNetEvent(event, eventData, eventOptions) {
  return new Promise(function emitPromise(resolve, reject) {
    return regeneratorRuntime.async(function emitPromise$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            resolve([]);

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, null, this);
  });
}

function emit(allLocalEvents, eventName, eventData) {
  var eventEmitOptions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  return new Promise(function emitPromise(resolve, reject) {
    var allResponses, emitNetEventResponses, localEventArray, localEventArrayPromises, emitLocalEventResponses;
    return regeneratorRuntime.async(function emitPromise$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            eventEmitOptions = R.merge(eventEmitOptions, {
              netEmitted: false
            });
            _context2.prev = 1;
            allResponses = [];
            // NET EVENTS

            if (eventEmitOptions.netEmitted) {
              _context2.next = 8;
              break;
            }

            _context2.next = 6;
            return regeneratorRuntime.awrap(emitNetEvent(eventName, eventData, eventEmitOptions));

          case 6:
            emitNetEventResponses = _context2.sent;

            allResponses = allResponses.concat(emitNetEventResponses);

          case 8:
            // LOCAL EVENTS
            localEventArray = allLocalEvents[eventName];
            localEventArrayPromises = R.map(function (singleEvent) {
              // debug('Jesus Events Emitter singleEvent.eventPromise', eventData, singleEvent.eventOptions, singleEvent.eventPromise)
              return singleEvent.eventPromise(eventData, eventEmitOptions, singleEvent.eventRegistrationOptions);
            }, localEventArray);
            _context2.next = 12;
            return regeneratorRuntime.awrap(Promise.all(localEventArrayPromises));

          case 12:
            emitLocalEventResponses = _context2.sent;


            allResponses = allResponses.concat(emitLocalEventResponses);
            resolve(allResponses);
            _context2.next = 20;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2['catch'](1);

            reject(_context2.t0);

          case 20:
          case 'end':
            return _context2.stop();
        }
      }
    }, null, this, [[1, 17]]);
  });
}
var curriedEmit = R.curryN(3, emit);

function register(allLocalEvents, eventName, eventPromise, eventRegistrationOptions) {
  eventRegistrationOptions = R.merge(eventRegistrationOptions, {
    localEvent: false
  });
  if (!allLocalEvents[eventName]) allLocalEvents[eventName] = [];
  allLocalEvents[eventName].push({ eventName: eventName, eventPromise: eventPromise, eventRegistrationOptions: eventRegistrationOptions });
  // debug('Jesus Events Emitter Register', allLocalEvents)
}
var curriedRegister = R.curryN(3, register);

module.exports = function getEventsEmitterPackage() {
  var allLocalEvents = {};
  return {
    on: curriedRegister(allLocalEvents),
    emit: curriedEmit(allLocalEvents)
  };
};