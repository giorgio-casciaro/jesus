var express = require('express-http2')
var bodyParser = require('body-parser')
var compression = require('compression')
var helmet = require('helmet')
var R = require('ramda')
var LOG = console
const PACKAGE = 'api.http'

var checkRequired = require('./jesus').checkRequired
module.exports = function getHttpApiPackage ({privateOnly = false, httpPort = 80, serviceMethodsFile }) {
  try {
    var httpApi
    var httpServer
    checkRequired({serviceMethodsFile})
    async function start () {
      httpApi = express()
      httpApi.use(compression({level: 1}))
      httpApi.use(bodyParser.json()) // support json encoded bodies
      httpApi.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
      httpApi.all('*', (req, res) => {
        var functionName = req.url.replace('/', '')
        var service = require(serviceMethodsFile)
        if (!service[functionName]) throw new Error(functionName + ' is not valid')
        LOG.debug(httpPort, serviceMethodsFile)
        var data = req.body || req.query
        service[functionName](data)
          .then(response => res.send(response))
          .catch(error => res.send(error))
      })
      httpServer = httpApi.listen(httpPort)
    }
    return {
      start,
      stop () {
        httpServer.close()
      },
      httpart () {
        httpServer.close(start)
      }
    }
  } catch (error) {
    LOG.error(error)
    throw error
  }
}

// {

// }
