var path = require('path')
var fs = require('fs')
var R = require('ramda')
//
// var debugActive = true
// var debugSaveTimeout
// var debugFile
// var debugRegistry = []
//
// var DEBUG = function (type, debug, msg = 'unknow', context = 'unknow') {
//   if (!debugActive) return null
//   debugRegistry.push({
//     [`${type} ${context} > ${msg}`]: debug
//   })
//   if (debugSaveTimeout) clearTimeout(debugSaveTimeout)
//   debugSaveTimeout = setTimeout(function () {
//     fs.writeFile(debugFile, JSON.stringify(debugRegistry, null, 4), 'utf8')
//   }, 1000)
// }
//
// var LOG = function (type, log, msg = 'unknow', context = 'unknow') {
//   const ANSI_RESET = '\u001B[0m'
//   const ANSI_BLACK = '\u001B[30m'
//   const ANSI_BACKGROUND_CYAN = '\u001B[46m'
//   console.log(`${ANSI_BACKGROUND_CYAN + ANSI_BLACK}`)
//   console.log(`LOG --> ${type} ${context} > ${msg} ${ANSI_RESET}`)
//   DEBUG(type, log, msg, context)
// }
//
// var ERROR = function (error) {
//   const ANSI_RESET = '\u001B[0m'
//   const ANSI_RED = '\u001B[31m'
//   console.log(`${ANSI_RED} ORIGINAL ERROR ${ANSI_RESET}`)
//   console.log(error.originalError || error)
//   console.log(`APP ERROR --> ${error.info && error.info.message ? error.info.message : 'unknow'}`)
//   console.log(`${ANSI_RED} APP TRACE ${ANSI_RESET}`)
//   if (error.getAppTrace)console.log(JSON.stringify(error.getAppTrace(), null, 4))
//   // if (error.toString)console.log(JSON.stringify(error.toString(), null, 4))
//   LOG('ERROR', error, 'jesus-test', 'APP-ERROR')
// }

module.exports = function getDI (SERVICE, PACKAGE) {
  return {
    authenticate: async({request}) => require('./fakeAuth.json'),
    authorize: async({route, request}) => true,
    // getEvents: (payload) => new Promise((resolve, reject) => {
    //   resolve(SERVICE.events)
    // }),
    // getConfig: (payload) => new Promise((resolve, reject) => {
    //   resolve(config)
    // }),
    registerRoute: async({route, routeFunction}) => SERVICE.routes[route] = routeFunction,
    callRoute: async({route, request}) => SERVICE.routes[route](request),
    deregisterRoute: async({route}) => SERVICE.routes[route](request),
    deregisterRoute: async({route}) => delete SERVICE.routes[route],
    registerEvent: async({name, route}) => {
      SERVICE.events[name] = {name, route}
    },
    deregisterEvent: async({name}) => delete SERVICE.events[event],
    emitEvent: async({name, payload}) => {}
  }
}
