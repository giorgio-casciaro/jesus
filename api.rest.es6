var express = require('express')
var bodyParser = require('body-parser');

var helmet = require('helmet')
var protobuf = require('protobufjs')// for validation
var R = require('ramda')
module.exports = function getGrpcApiPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'api.rest'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['proto', 'restPort'], PACKAGE)
    DI = checkRequired(DI, [ 'getRoutes', 'throwError', 'log', 'debug'], PACKAGE)

    var restApi
    var restServer

    return {
      async start () {
        var protoFile = await getValuePromise(CONFIG.proto)
        var restPort = await getValuePromise(CONFIG.restPort)
        restApi = express()
        restApi.use(bodyParser.json()); // support json encoded bodies
        restApi.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

        R.mapObjIndexed((routeFunction, routeName) => {
          var restBridge = (req, res) => {
            var data=req.body||req.query
            routeFunction(data)
            .then(response => res.send(response))
            .catch(error => res.send(error))
          }
          restApi.get('/' + routeName, restBridge)
          restApi.post('/' + routeName, restBridge)
        }, DI.getRoutes())
        restServer = restApi.listen(restPort)
      },
      stop () {
        restServer.close()
      },
      restart () {
        restServer.close(start)
      }
    }
  } catch (error) {
    DI.throwError('getGrpcApiPackage(CONFIG, DI)', error)
  }
}

// {

// }
