var express = require('express-http2')
var bodyParser = require('body-parser');
var compression = require('compression')
var helmet = require('helmet')
var R = require('ramda')
module.exports = function getHttpApiPackage (CONFIG, DI) {
  try {
    const PACKAGE = 'api.http'
    const getValuePromise = require('./jesus').getValuePromise
    const checkRequired = require('./jesus').checkRequired
    CONFIG = checkRequired(CONFIG, ['httpPort'], PACKAGE)
    DI = checkRequired(DI, [ 'getRoutes', 'throwError', 'log', 'debug'], PACKAGE)

    var httpApi
    var httpServer

    return {
      async start () {
        var protoFile = await getValuePromise(CONFIG.proto)
        var httpPort = await getValuePromise(CONFIG.httpPort)
        httpApi = express()
        httpApi.use(compression({level: 1}))
        httpApi.use(bodyParser.json()); // support json encoded bodies
        httpApi.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

        R.mapObjIndexed((routeFunction, routeName) => {
          var httpBridge = (req, res) => {
            var data=req.body||req.query
            routeFunction(data)
            .then(response => res.send(response))
            .catch(error => res.send(error))
          }
          httpApi.get('/' + routeName, httpBridge)
          httpApi.post('/' + routeName, httpBridge)
        }, DI.getRoutes())
        httpServer = httpApi.listen(httpPort)
      },
      stop () {
        httpServer.close()
      },
      httpart () {
        httpServer.close(start)
      }
    }
  } catch (error) {
    DI.throwError('getHttpApiPackage(CONFIG, DI)', error)
  }
}

// {

// }
