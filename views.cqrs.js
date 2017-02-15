'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
// var path = require('path')
// var fs = require('fs')
var jesus = require('./jesus');
var PACKAGE = 'views.cqrs';
var checkRequired = require('./jesus').checkRequired;
var LOG = console;

module.exports = function getViewsCqrsPackage(_ref) {
  var viewsSnapshotsMaxMutations = _ref.viewsSnapshotsMaxMutations,
      viewsStoragePackage = _ref.viewsStoragePackage,
      viewsSnapshotsStoragePackage = _ref.viewsSnapshotsStoragePackage,
      mutationsPackage = _ref.mutationsPackage;

  var _ret;

  return regeneratorRuntime.async(function getViewsCqrsPackage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          _ret = function () {
            var updateView = function _callee(_ref2) {
              var objId = _ref2.objId,
                  _ref2$loadSnapshot = _ref2.loadSnapshot,
                  loadSnapshot = _ref2$loadSnapshot === undefined ? true : _ref2$loadSnapshot,
                  _ref2$loadMutations = _ref2.loadMutations,
                  loadMutations = _ref2$loadMutations === undefined ? true : _ref2$loadMutations,
                  _ref2$addMutations = _ref2.addMutations,
                  addMutations = _ref2$addMutations === undefined ? [] : _ref2$addMutations;
              var lastSnapshot, mutations, lastSnapshotFromDb, updatedView;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;

                      LOG.debug('updateView', { context: PACKAGE, debug: { objId: objId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations } });
                      lastSnapshot = { timestamp: 0, state: {} };
                      mutations = [];

                      if (!loadSnapshot) {
                        _context.next = 9;
                        break;
                      }

                      _context.next = 7;
                      return regeneratorRuntime.awrap(viewsSnapshotsStoragePackage.find({ query: { objId: objId }, sort: { timestamp: 1 }, limit: 1, start: 0 }));

                    case 7:
                      lastSnapshotFromDb = _context.sent;

                      if (lastSnapshotFromDb && lastSnapshotFromDb[0]) lastSnapshot = lastSnapshotFromDb[0];

                    case 9:
                      if (!loadMutations) {
                        _context.next = 13;
                        break;
                      }

                      _context.next = 12;
                      return regeneratorRuntime.awrap(mutationsPackage.getObjMutations({ objId: objId, minTimestamp: lastSnapshot.timestamp }));

                    case 12:
                      mutations = _context.sent;

                    case 13:

                      mutations = mutations.concat(addMutations);
                      // clear array, remove duplicate ids
                      mutations = R.uniqBy(R.prop('_id'), mutations);
                      _context.next = 17;
                      return regeneratorRuntime.awrap(mutationsPackage.applyMutations({ state: lastSnapshot.state, mutations: mutations }));

                    case 17:
                      updatedView = _context.sent;

                      viewsStoragePackage.update({ queriesArray: [{ '_id': objId }], dataArray: [updatedView], insertIfNotExists: true });
                      LOG.debug('updatedView', { context: PACKAGE, debug: { updatedView: updatedView, mutations: mutations } });

                      if (!(viewsSnapshotsMaxMutations < mutations && mutations.length)) {
                        _context.next = 23;
                        break;
                      }

                      _context.next = 23;
                      return regeneratorRuntime.awrap(viewsSnapshotsStorage.insert({ timestamp: Date.now(), state: updatedView }));

                    case 23:
                      return _context.abrupt('return', true);

                    case 26:
                      _context.prev = 26;
                      _context.t0 = _context['catch'](0);

                      LOG.error(PACKAGE, _context.t0, { objId: objId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations });
                      throw new Error(PACKAGE + 'updateView');

                    case 30:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this, [[0, 26]]);
            };

            checkRequired({ viewsSnapshotsMaxMutations: viewsSnapshotsMaxMutations, viewsStoragePackage: viewsStoragePackage, viewsSnapshotsStoragePackage: viewsSnapshotsStoragePackage, mutationsPackage: mutationsPackage }, PACKAGE);

            return {
              v: {
                refreshViews: function refreshViews(_ref3) {
                  var objIds = _ref3.objIds,
                      loadSnapshot = _ref3.loadSnapshot,
                      loadMutations = _ref3.loadMutations,
                      addMutations = _ref3.addMutations;

                  LOG.debug('refreshsViews', { context: PACKAGE, debug: { objIds: objIds, loadSnapshot: loadSnapshot, addMutations: addMutations } });
                  function singleView(objId) {
                    return updateView({ objId: objId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations });
                  }
                  return Promise.all(R.map(singleView, objIds));
                },
                get: viewsStoragePackage.get
              }
            };
          }();

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt('return', _ret.v);

        case 4:
          _context2.next = 10;
          break;

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2['catch'](0);

          LOG.error(PACKAGE, _context2.t0);
          throw new Error(PACKAGE + 'getViewsCqrsPackage()');

        case 10:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this, [[0, 6]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzLmNxcnMuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiamVzdXMiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsIkxPRyIsImNvbnNvbGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0Vmlld3NDcXJzUGFja2FnZSIsInZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zIiwidmlld3NTdG9yYWdlUGFja2FnZSIsInZpZXdzU25hcHNob3RzU3RvcmFnZVBhY2thZ2UiLCJtdXRhdGlvbnNQYWNrYWdlIiwidXBkYXRlVmlldyIsIm9iaklkIiwibG9hZFNuYXBzaG90IiwibG9hZE11dGF0aW9ucyIsImFkZE11dGF0aW9ucyIsImRlYnVnIiwiY29udGV4dCIsImxhc3RTbmFwc2hvdCIsInRpbWVzdGFtcCIsInN0YXRlIiwibXV0YXRpb25zIiwiZmluZCIsInF1ZXJ5Iiwic29ydCIsImxpbWl0Iiwic3RhcnQiLCJsYXN0U25hcHNob3RGcm9tRGIiLCJnZXRPYmpNdXRhdGlvbnMiLCJtaW5UaW1lc3RhbXAiLCJjb25jYXQiLCJ1bmlxQnkiLCJwcm9wIiwiYXBwbHlNdXRhdGlvbnMiLCJ1cGRhdGVkVmlldyIsInVwZGF0ZSIsInF1ZXJpZXNBcnJheSIsImRhdGFBcnJheSIsImluc2VydElmTm90RXhpc3RzIiwibGVuZ3RoIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlIiwiaW5zZXJ0IiwiRGF0ZSIsIm5vdyIsImVycm9yIiwiRXJyb3IiLCJyZWZyZXNoVmlld3MiLCJvYmpJZHMiLCJzaW5nbGVWaWV3IiwiUHJvbWlzZSIsImFsbCIsIm1hcCIsImdldCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0E7QUFDQTtBQUNBLElBQUlDLFFBQVFELFFBQVEsU0FBUixDQUFaO0FBQ0EsSUFBTUUsVUFBVSxZQUFoQjtBQUNBLElBQU1DLGdCQUFnQkgsUUFBUSxTQUFSLEVBQW1CRyxhQUF6QztBQUNBLElBQUlDLE1BQU1D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LENBMUNPOztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6InZpZXdzLmNxcnMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG4vLyB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuLy8gdmFyIGZzID0gcmVxdWlyZSgnZnMnKVxudmFyIGplc3VzID0gcmVxdWlyZSgnLi9qZXN1cycpXG5jb25zdCBQQUNLQUdFID0gJ3ZpZXdzLmNxcnMnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbnZhciBMT0cgPSBjb25zb2xlXG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0Vmlld3NDcXJzUGFja2FnZSAoe3ZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zLCB2aWV3c1N0b3JhZ2VQYWNrYWdlLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlLCBtdXRhdGlvbnNQYWNrYWdlfSkge1xuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe3ZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zLCB2aWV3c1N0b3JhZ2VQYWNrYWdlLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlLCBtdXRhdGlvbnNQYWNrYWdlfSwgUEFDS0FHRSlcbiAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVWaWV3ICh7b2JqSWQsIGxvYWRTbmFwc2hvdCA9IHRydWUsIGxvYWRNdXRhdGlvbnMgPSB0cnVlLCBhZGRNdXRhdGlvbnMgPSBbXX0pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIExPRy5kZWJ1ZygndXBkYXRlVmlldycsIHsgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtvYmpJZCwgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnN9fSlcbiAgICAgICAgdmFyIGxhc3RTbmFwc2hvdCA9IHt0aW1lc3RhbXA6IDAsIHN0YXRlOiB7fX1cbiAgICAgICAgdmFyIG11dGF0aW9ucyA9IFtdXG4gICAgICAgIGlmIChsb2FkU25hcHNob3QpIHtcbiAgICAgICAgICB2YXIgbGFzdFNuYXBzaG90RnJvbURiID0gYXdhaXQgdmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZS5maW5kKHtxdWVyeToge29iaklkOiBvYmpJZH0sIHNvcnQ6IHt0aW1lc3RhbXA6IDF9LCBsaW1pdDogMSwgc3RhcnQ6IDB9KVxuICAgICAgICAgIGlmIChsYXN0U25hcHNob3RGcm9tRGIgJiYgbGFzdFNuYXBzaG90RnJvbURiWzBdKSBsYXN0U25hcHNob3QgPSBsYXN0U25hcHNob3RGcm9tRGJbMF1cbiAgICAgICAgfVxuICAgICAgICBpZiAobG9hZE11dGF0aW9ucyltdXRhdGlvbnMgPSBhd2FpdCBtdXRhdGlvbnNQYWNrYWdlLmdldE9iak11dGF0aW9ucyh7b2JqSWQsIG1pblRpbWVzdGFtcDogbGFzdFNuYXBzaG90LnRpbWVzdGFtcH0pXG5cbiAgICAgICAgbXV0YXRpb25zID0gbXV0YXRpb25zLmNvbmNhdChhZGRNdXRhdGlvbnMpXG4gICAgICAgIC8vIGNsZWFyIGFycmF5LCByZW1vdmUgZHVwbGljYXRlIGlkc1xuICAgICAgICBtdXRhdGlvbnMgPSBSLnVuaXFCeShSLnByb3AoJ19pZCcpLCBtdXRhdGlvbnMpXG4gICAgICAgIHZhciB1cGRhdGVkVmlldyA9IGF3YWl0IG11dGF0aW9uc1BhY2thZ2UuYXBwbHlNdXRhdGlvbnMoe3N0YXRlOiBsYXN0U25hcHNob3Quc3RhdGUsIG11dGF0aW9uc30pXG4gICAgICAgIHZpZXdzU3RvcmFnZVBhY2thZ2UudXBkYXRlKHtxdWVyaWVzQXJyYXk6IFt7J19pZCc6IG9iaklkfV0sIGRhdGFBcnJheTogW3VwZGF0ZWRWaWV3XSwgaW5zZXJ0SWZOb3RFeGlzdHM6IHRydWV9KVxuICAgICAgICBMT0cuZGVidWcoJ3VwZGF0ZWRWaWV3JywgeyBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge3VwZGF0ZWRWaWV3LCBtdXRhdGlvbnN9fSlcblxuICAgICAgICBpZiAodmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnMgPCBtdXRhdGlvbnMgJiYgbXV0YXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgIGF3YWl0IHZpZXdzU25hcHNob3RzU3RvcmFnZS5pbnNlcnQoe3RpbWVzdGFtcDogRGF0ZS5ub3coKSwgc3RhdGU6IHVwZGF0ZWRWaWV3fSkgLy8gdXBkYXRlIHNuYXBzaG90IGlmIHJlcXVpcmVkXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIExPRy5lcnJvcihQQUNLQUdFLCBlcnJvciwge29iaklkLCBsb2FkU25hcHNob3QsIGxvYWRNdXRhdGlvbnMsIGFkZE11dGF0aW9uc30pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihQQUNLQUdFICsgYHVwZGF0ZVZpZXdgKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcmVmcmVzaFZpZXdzOiBmdW5jdGlvbiByZWZyZXNoVmlld3MgKHtvYmpJZHMsIGxvYWRTbmFwc2hvdCwgbG9hZE11dGF0aW9ucywgYWRkTXV0YXRpb25zIH0pIHtcbiAgICAgICAgTE9HLmRlYnVnKCdyZWZyZXNoc1ZpZXdzJywgeyBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge29iaklkcywgbG9hZFNuYXBzaG90LCBhZGRNdXRhdGlvbnN9fSlcbiAgICAgICAgZnVuY3Rpb24gc2luZ2xlVmlldyAob2JqSWQpIHtcbiAgICAgICAgICByZXR1cm4gdXBkYXRlVmlldyh7b2JqSWQsIGxvYWRTbmFwc2hvdCwgbG9hZE11dGF0aW9ucywgYWRkTXV0YXRpb25zfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoUi5tYXAoc2luZ2xlVmlldywgb2JqSWRzKSlcbiAgICAgIH0sXG4gICAgICBnZXQ6IHZpZXdzU3RvcmFnZVBhY2thZ2UuZ2V0XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIExPRy5lcnJvcihQQUNLQUdFLCBlcnJvcilcbiAgICB0aHJvdyBuZXcgRXJyb3IoUEFDS0FHRSArIGBnZXRWaWV3c0NxcnNQYWNrYWdlKClgKVxuICB9XG59XG4iXX0=