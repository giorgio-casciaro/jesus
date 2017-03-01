'use strict';

if (!global._babelPolyfill) require('babel-polyfill');
var restler = require('restler');
var jesus = require('../jesus');
var path = require('path');
function resourceInsert() {
  var loops = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  var steps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
  var baseUrl = arguments[2];
  var createRequest = arguments[3];
  var updateRequest = arguments[4];
  var i, createdResponse, readResponse, updateResponse;
  return regeneratorRuntime.async(function resourceInsert$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          i = 0;

        case 1:
          if (!(i < loops)) {
            _context.next = 20;
            break;
          }

          _context.next = 4;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            restler.postJson(baseUrl + 'createResource', createRequest).on('complete', function (dataResponse, response) {
              createdResponse = dataResponse;
              resolve();
            });
          }));

        case 4:
          if (!(steps === 1)) {
            _context.next = 6;
            break;
          }

          return _context.abrupt('continue', 17);

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            restler.postJson(baseUrl + 'readResource', { id: createdResponse.id, userId: 'test', token: 'test' }).on('complete', function (dataResponse, response) {
              readResponse = dataResponse;
              resolve();
            });
          }));

        case 8:
          if (!(steps === 2)) {
            _context.next = 10;
            break;
          }

          return _context.abrupt('continue', 17);

        case 10:
          updateRequest.id = createdResponse.id;
          _context.next = 13;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            restler.postJson(baseUrl + 'updateResource', updateRequest).on('complete', function (dataResponse, response) {
              updateResponse = dataResponse;
              resolve();
            });
          }));

        case 13:
          if (!(steps === 3)) {
            _context.next = 15;
            break;
          }

          return _context.abrupt('continue', 17);

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(new Promise(function (resolve, reject) {
            restler.postJson(baseUrl + 'deleteResource', { id: createdResponse.id, userId: 'test', token: 'test' }).on('complete', function (dataResponse, response) {
              readResponse = dataResponse;
              resolve();
            });
          }));

        case 17:
          i++;
          _context.next = 1;
          break;

        case 20:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
}
function start() {
  var MS_RESOURCES, MS_EVENTS_EMITTER, MS_VIEW, MS_AUTHORIZATIONS, MS_LOGS, MS_EVENTS_EMITTER_URL, baseUrl, createRequest, updateRequest;
  return regeneratorRuntime.async(function start$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(require('./services/resources/start')());

        case 2:
          MS_RESOURCES = _context2.sent;
          _context2.next = 5;
          return regeneratorRuntime.awrap(require('./services/eventsEmitter/start')());

        case 5:
          MS_EVENTS_EMITTER = _context2.sent;
          _context2.next = 8;
          return regeneratorRuntime.awrap(require('./services/view/start')());

        case 8:
          MS_VIEW = _context2.sent;
          _context2.next = 11;
          return regeneratorRuntime.awrap(require('./services/authorizations/start')());

        case 11:
          MS_AUTHORIZATIONS = _context2.sent;
          _context2.next = 14;
          return regeneratorRuntime.awrap(require('./services/logs/start')());

        case 14:
          MS_LOGS = _context2.sent;
          _context2.next = 17;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 5000);
          }));

        case 17:
          MS_EVENTS_EMITTER_URL = 'http://127.0.0.1:' + MS_EVENTS_EMITTER.SHARED_CONFIG.httpPublicApiPort + '/';
          baseUrl = 'http://127.0.0.1:' + MS_RESOURCES.SHARED_CONFIG.httpPublicApiPort + '/';
          createRequest = { data: { title: '123456', body: '123456', email: '123456@vopa.it' }, userId: 'test', token: 'test' };
          updateRequest = { data: { title: '789456', body: '789456', email: '789456@vopa.it' }, userId: 'test', token: 'test' };

          console.profile('processPixels()');
          _context2.next = 24;
          return regeneratorRuntime.awrap(resourceInsert(1, 1, baseUrl, createRequest, updateRequest));

        case 24:
          console.profileEnd();
          _context2.next = 27;
          return regeneratorRuntime.awrap(new Promise(function (resolve) {
            return setTimeout(resolve, 3000);
          }));

        case 27:
          MS_RESOURCES.stop();
          MS_EVENTS_EMITTER.stop();
          MS_AUTHORIZATIONS.stop();
          MS_LOGS.stop();
          //MS_VIEW.stop()

        case 31:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this);
}
start();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UucHJvZmlsaW5nLmVzNiJdLCJuYW1lcyI6WyJnbG9iYWwiLCJfYmFiZWxQb2x5ZmlsbCIsInJlcXVpcmUiLCJyZXN0bGVyIiwiamVzdXMiLCJwYXRoIiwicmVzb3VyY2VJbnNlcnQiLCJsb29wcyIsInN0ZXBzIiwiYmFzZVVybCIsImNyZWF0ZVJlcXVlc3QiLCJ1cGRhdGVSZXF1ZXN0IiwiaSIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicG9zdEpzb24iLCJvbiIsImRhdGFSZXNwb25zZSIsInJlc3BvbnNlIiwiY3JlYXRlZFJlc3BvbnNlIiwiaWQiLCJ1c2VySWQiLCJ0b2tlbiIsInJlYWRSZXNwb25zZSIsInVwZGF0ZVJlc3BvbnNlIiwic3RhcnQiLCJNU19SRVNPVVJDRVMiLCJNU19FVkVOVFNfRU1JVFRFUiIsIk1TX1ZJRVciLCJNU19BVVRIT1JJWkFUSU9OUyIsIk1TX0xPR1MiLCJzZXRUaW1lb3V0IiwiTVNfRVZFTlRTX0VNSVRURVJfVVJMIiwiU0hBUkVEX0NPTkZJRyIsImh0dHBQdWJsaWNBcGlQb3J0IiwiZGF0YSIsInRpdGxlIiwiYm9keSIsImVtYWlsIiwiY29uc29sZSIsInByb2ZpbGUiLCJwcm9maWxlRW5kIiwic3RvcCJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJLENBQUNBLE9BQU9DLGNBQVosRUFBMkJDLFFBQVEsZ0JBQVI7QUFDM0IsSUFBSUMsVUFBVUQsUUFBUSxTQUFSLENBQWQ7QUFDQSxJQUFJRSxRQUFRRixRQUFRLFVBQVIsQ0FBWjtBQUNBLElBQUlHLE9BQU9ILFFBQVEsTUFBUixDQUFYO0FBQ0EsU0FBZUksY0FBZjtBQUFBLE1BQStCQyxLQUEvQix1RUFBdUMsRUFBdkM7QUFBQSxNQUEyQ0MsS0FBM0MsdUVBQW1ELEVBQW5EO0FBQUEsTUFBdURDLE9BQXZEO0FBQUEsTUFBZ0VDLGFBQWhFO0FBQUEsTUFBK0VDLGFBQS9FO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNXQyxXQURYLEdBQ2UsQ0FEZjs7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Q0FBZ0NDLGlCQVBsRjtBQVNNMUIsaUJBVE4seUJBU29Da0IsYUFBYU8sYUFBYixDQUEyQkMsaUJBVC9EO0FBVU16Qix1QkFWTixHQVVzQixFQUFDMEIsTUFBTSxFQUFDQyxPQUFPLFFBQVIsRUFBa0JDLE1BQU0sUUFBeEIsRUFBa0NDLE9BQU8sZ0JBQXpDLEVBQVAsRUFBbUVqQixRQUFRLE1BQTNFLEVBQW1GQyxPQUFPLE1BQTFGLEVBVnRCO0FBV01aLHVCQVhOLEdBV3NCLEVBQUN5QixNQUFNLEVBQUNDLE9BQU8sUUFBUixFQUFrQkMsTUFBTSxRQUF4QixFQUFrQ0MsT0FBTyxnQkFBekMsRUFBUCxFQUFtRWpCLFFBQVEsTUFBM0UsRUFBbUZDLE9BQU8sTUFBMUYsRUFYdEI7O0FBWUVpQixrQkFBUUMsT0FBUixDQUFnQixpQkFBaEI7QUFaRjtBQUFBLDBDQWFRbkMsZUFBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCRyxPQUFyQixFQUE4QkMsYUFBOUIsRUFBNkNDLGFBQTdDLENBYlI7O0FBQUE7QUFjRTZCLGtCQUFRRSxVQUFSO0FBZEY7QUFBQSwwQ0FlUSxJQUFJN0IsT0FBSixDQUFZLFVBQUNDLE9BQUQ7QUFBQSxtQkFBYWtCLFdBQVdsQixPQUFYLEVBQW9CLElBQXBCLENBQWI7QUFBQSxXQUFaLENBZlI7O0FBQUE7QUFnQkVhLHVCQUFhZ0IsSUFBYjtBQUNBZiw0QkFBa0JlLElBQWxCO0FBQ0FiLDRCQUFrQmEsSUFBbEI7QUFDQVosa0JBQVFZLElBQVI7QUFDQTs7QUFwQkY7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFzQkFqQiIsImZpbGUiOiJiYXNlLnByb2ZpbGluZy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJpZiAoIWdsb2JhbC5fYmFiZWxQb2x5ZmlsbClyZXF1aXJlKCdiYWJlbC1wb2x5ZmlsbCcpXG52YXIgcmVzdGxlciA9IHJlcXVpcmUoJ3Jlc3RsZXInKVxudmFyIGplc3VzID0gcmVxdWlyZSgnLi4vamVzdXMnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbmFzeW5jIGZ1bmN0aW9uIHJlc291cmNlSW5zZXJ0IChsb29wcyA9IDEwLCBzdGVwcyA9IDEwLCBiYXNlVXJsLCBjcmVhdGVSZXF1ZXN0LCB1cGRhdGVSZXF1ZXN0KSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbG9vcHM7IGkrKykge1xuICAgIHZhciBjcmVhdGVkUmVzcG9uc2UsIHJlYWRSZXNwb25zZSwgdXBkYXRlUmVzcG9uc2VcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAnY3JlYXRlUmVzb3VyY2UnLCBjcmVhdGVSZXF1ZXN0KS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICBjcmVhdGVkUmVzcG9uc2UgPSBkYXRhUmVzcG9uc2VcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgIH0pXG4gICAgaWYgKHN0ZXBzID09PSAxKSBjb250aW51ZVxuICAgIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlc3RsZXIucG9zdEpzb24oYmFzZVVybCArICdyZWFkUmVzb3VyY2UnLCB7aWQ6IGNyZWF0ZWRSZXNwb25zZS5pZCwgdXNlcklkOiAndGVzdCcsIHRva2VuOiAndGVzdCd9KS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICByZWFkUmVzcG9uc2UgPSBkYXRhUmVzcG9uc2VcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICB9KVxuICAgIH0pXG4gICAgaWYgKHN0ZXBzID09PSAyKSBjb250aW51ZVxuICAgIHVwZGF0ZVJlcXVlc3QuaWQgPSBjcmVhdGVkUmVzcG9uc2UuaWRcbiAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXN0bGVyLnBvc3RKc29uKGJhc2VVcmwgKyAndXBkYXRlUmVzb3VyY2UnLCB1cGRhdGVSZXF1ZXN0KS5vbignY29tcGxldGUnLCBmdW5jdGlvbiAoZGF0YVJlc3BvbnNlLCByZXNwb25zZSkge1xuICAgICAgICB1cGRhdGVSZXNwb25zZSA9IGRhdGFSZXNwb25zZVxuICAgICAgICByZXNvbHZlKClcbiAgICAgIH0pXG4gICAgfSlcbiAgICBpZiAoc3RlcHMgPT09IDMpIGNvbnRpbnVlXG4gICAgYXdhaXQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVzdGxlci5wb3N0SnNvbihiYXNlVXJsICsgJ2RlbGV0ZVJlc291cmNlJywge2lkOiBjcmVhdGVkUmVzcG9uc2UuaWQsIHVzZXJJZDogJ3Rlc3QnLCB0b2tlbjogJ3Rlc3QnfSkub24oJ2NvbXBsZXRlJywgZnVuY3Rpb24gKGRhdGFSZXNwb25zZSwgcmVzcG9uc2UpIHtcbiAgICAgICAgcmVhZFJlc3BvbnNlID0gZGF0YVJlc3BvbnNlXG4gICAgICAgIHJlc29sdmUoKVxuICAgICAgfSlcbiAgICB9KVxuICB9XG59XG5hc3luYyBmdW5jdGlvbiBzdGFydCAoKSB7XG4gIHZhciBNU19SRVNPVVJDRVMgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL3Jlc291cmNlcy9zdGFydCcpKClcbiAgdmFyIE1TX0VWRU5UU19FTUlUVEVSID0gYXdhaXQgcmVxdWlyZSgnLi9zZXJ2aWNlcy9ldmVudHNFbWl0dGVyL3N0YXJ0JykoKVxuICB2YXIgTVNfVklFVyA9IGF3YWl0IHJlcXVpcmUoJy4vc2VydmljZXMvdmlldy9zdGFydCcpKClcbiAgdmFyIE1TX0FVVEhPUklaQVRJT05TID0gYXdhaXQgcmVxdWlyZSgnLi9zZXJ2aWNlcy9hdXRob3JpemF0aW9ucy9zdGFydCcpKClcbiAgdmFyIE1TX0xPR1MgPSBhd2FpdCByZXF1aXJlKCcuL3NlcnZpY2VzL2xvZ3Mvc3RhcnQnKSgpXG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIDUwMDApKVxuICB2YXIgTVNfRVZFTlRTX0VNSVRURVJfVVJMID0gYGh0dHA6Ly8xMjcuMC4wLjE6JHtNU19FVkVOVFNfRU1JVFRFUi5TSEFSRURfQ09ORklHLmh0dHBQdWJsaWNBcGlQb3J0fS9gXG5cbiAgdmFyIGJhc2VVcmwgPSBgaHR0cDovLzEyNy4wLjAuMToke01TX1JFU09VUkNFUy5TSEFSRURfQ09ORklHLmh0dHBQdWJsaWNBcGlQb3J0fS9gXG4gIHZhciBjcmVhdGVSZXF1ZXN0ID0ge2RhdGE6IHt0aXRsZTogJzEyMzQ1NicsIGJvZHk6ICcxMjM0NTYnLCBlbWFpbDogJzEyMzQ1NkB2b3BhLml0J30sIHVzZXJJZDogJ3Rlc3QnLCB0b2tlbjogJ3Rlc3QnfVxuICB2YXIgdXBkYXRlUmVxdWVzdCA9IHtkYXRhOiB7dGl0bGU6ICc3ODk0NTYnLCBib2R5OiAnNzg5NDU2JywgZW1haWw6ICc3ODk0NTZAdm9wYS5pdCd9LCB1c2VySWQ6ICd0ZXN0JywgdG9rZW46ICd0ZXN0J31cbiAgY29uc29sZS5wcm9maWxlKCdwcm9jZXNzUGl4ZWxzKCknKVxuICBhd2FpdCByZXNvdXJjZUluc2VydCgxLCAxLCBiYXNlVXJsLCBjcmVhdGVSZXF1ZXN0LCB1cGRhdGVSZXF1ZXN0KVxuICBjb25zb2xlLnByb2ZpbGVFbmQoKVxuICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAzMDAwKSlcbiAgTVNfUkVTT1VSQ0VTLnN0b3AoKVxuICBNU19FVkVOVFNfRU1JVFRFUi5zdG9wKClcbiAgTVNfQVVUSE9SSVpBVElPTlMuc3RvcCgpXG4gIE1TX0xPR1Muc3RvcCgpXG4gIC8vTVNfVklFVy5zdG9wKClcbn1cbnN0YXJ0KClcbiJdfQ==