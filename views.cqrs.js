'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
var shorthash = require('shorthash').unique;
// var path = require('path')
// var fs = require('fs')
var jesus = require('./jesus');
var PACKAGE = 'views.cqrs';
var checkRequired = require('./jesus').checkRequired;

module.exports = function getViewsCqrsPackage(_ref) {
  var getConsole = _ref.getConsole,
      serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      viewsSnapshotsMaxMutations = _ref.viewsSnapshotsMaxMutations,
      viewsStoragePackage = _ref.viewsStoragePackage,
      viewsSnapshotsStoragePackage = _ref.viewsSnapshotsStoragePackage,
      mutationsPackage = _ref.mutationsPackage;

  var CONSOLE, errorThrow, _ret;

  return regeneratorRuntime.async(function getViewsCqrsPackage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
          errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
          _context2.prev = 2;

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

                      CONSOLE.debug('updateView', { objId: objId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations });
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

                      // META INFO _view
                      if (updatedView._viewBuilded) delete updatedView._viewBuilded;
                      if (updatedView._viewHash) delete updatedView._viewHash;
                      updatedView._viewHash = shorthash(JSON.stringify(updatedView));
                      updatedView._viewBuilded = Date.now();
                      viewsStoragePackage.update({ queriesArray: [{ '_id': objId }], dataArray: [updatedView], insertIfNotExists: true });
                      CONSOLE.debug('updatedView', { updatedView: updatedView, mutations: mutations });

                      if (!(viewsSnapshotsMaxMutations < mutations && mutations.length)) {
                        _context.next = 27;
                        break;
                      }

                      _context.next = 27;
                      return regeneratorRuntime.awrap(viewsSnapshotsStorage.insert({ timestamp: Date.now(), state: updatedView }));

                    case 27:
                      return _context.abrupt('return', updatedView);

                    case 30:
                      _context.prev = 30;
                      _context.t0 = _context['catch'](0);

                      CONSOLE.error(_context.t0, { objId: objId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations });
                      throw new Error(PACKAGE + ' updateView');

                    case 34:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this, [[0, 30]]);
            };

            checkRequired({ serviceName: serviceName, serviceId: serviceId, viewsSnapshotsMaxMutations: viewsSnapshotsMaxMutations, viewsStoragePackage: viewsStoragePackage, viewsSnapshotsStoragePackage: viewsSnapshotsStoragePackage, mutationsPackage: mutationsPackage });

            return {
              v: {
                refreshViews: function refreshViews(_ref3) {
                  var objIds = _ref3.objIds,
                      loadSnapshot = _ref3.loadSnapshot,
                      loadMutations = _ref3.loadMutations,
                      addMutations = _ref3.addMutations;

                  CONSOLE.debug('refreshsViews', { objIds: objIds, loadSnapshot: loadSnapshot, addMutations: addMutations });
                  function singleView(objId) {
                    return updateView({ objId: objId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations });
                  }
                  return Promise.all(R.map(singleView, objIds));
                },
                get: viewsStoragePackage.get,
                find: viewsStoragePackage.find
              }
            };
          }();

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context2.next = 6;
            break;
          }

          return _context2.abrupt('return', _ret.v);

        case 6:
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2['catch'](2);

          errorThrow('getViewsCqrsPackage()', { error: _context2.t0 });

        case 11:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this, [[2, 8]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzLmNxcnMuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2hvcnRoYXNoIiwidW5pcXVlIiwiamVzdXMiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRWaWV3c0NxcnNQYWNrYWdlIiwiZ2V0Q29uc29sZSIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwidmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnMiLCJ2aWV3c1N0b3JhZ2VQYWNrYWdlIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSIsIm11dGF0aW9uc1BhY2thZ2UiLCJDT05TT0xFIiwiZXJyb3JUaHJvdyIsInVwZGF0ZVZpZXciLCJvYmpJZCIsImxvYWRTbmFwc2hvdCIsImxvYWRNdXRhdGlvbnMiLCJhZGRNdXRhdGlvbnMiLCJkZWJ1ZyIsImxhc3RTbmFwc2hvdCIsInRpbWVzdGFtcCIsInN0YXRlIiwibXV0YXRpb25zIiwiZmluZCIsInF1ZXJ5Iiwic29ydCIsImxpbWl0Iiwic3RhcnQiLCJsYXN0U25hcHNob3RGcm9tRGIiLCJnZXRPYmpNdXRhdGlvbnMiLCJtaW5UaW1lc3RhbXAiLCJjb25jYXQiLCJ1bmlxQnkiLCJwcm9wIiwiYXBwbHlNdXRhdGlvbnMiLCJ1cGRhdGVkVmlldyIsIl92aWV3QnVpbGRlZCIsIl92aWV3SGFzaCIsIkpTT04iLCJzdHJpbmdpZnkiLCJEYXRlIiwibm93IiwidXBkYXRlIiwicXVlcmllc0FycmF5IiwiZGF0YUFycmF5IiwiaW5zZXJ0SWZOb3RFeGlzdHMiLCJsZW5ndGgiLCJ2aWV3c1NuYXBzaG90c1N0b3JhZ2UiLCJpbnNlcnQiLCJlcnJvciIsIkVycm9yIiwicmVmcmVzaFZpZXdzIiwib2JqSWRzIiwic2luZ2xlVmlldyIsIlByb21pc2UiLCJhbGwiLCJtYXAiLCJnZXQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLFlBQVlELFFB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Z0I7O0FBQ3pGTiwwQkFBUU8sS0FBUixDQUFjLGVBQWQsRUFBK0IsRUFBQ2tDLGNBQUQsRUFBU3JDLDBCQUFULEVBQXVCRSwwQkFBdkIsRUFBL0I7QUFDQSwyQkFBU29DLFVBQVQsQ0FBcUJ2QyxLQUFyQixFQUE0QjtBQUMxQiwyQkFBT0QsV0FBVyxFQUFDQyxZQUFELEVBQVFDLDBCQUFSLEVBQXNCQyw0QkFBdEIsRUFBcUNDLDBCQUFyQyxFQUFYLENBQVA7QUFDRDtBQUNELHlCQUFPcUMsUUFBUUMsR0FBUixDQUFZN0QsRUFBRThELEdBQUYsQ0FBTUgsVUFBTixFQUFrQkQsTUFBbEIsQ0FBWixDQUFQO0FBQ0QsaUJBUEk7QUFRTEsscUJBQUtqRCxvQkFBb0JpRCxHQVJwQjtBQVNMbEMsc0JBQU1mLG9CQUFvQmU7QUFUckI7QUFBUDtBQXJDYTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQWlEYlgsOENBQW9DLEVBQUNxQyxtQkFBRCxFQUFwQzs7QUFqRGE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoidmlld3MuY3Fycy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBzaG9ydGhhc2ggPSByZXF1aXJlKCdzaG9ydGhhc2gnKS51bmlxdWVcbi8vIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4vLyB2YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgamVzdXMgPSByZXF1aXJlKCcuL2plc3VzJylcbmNvbnN0IFBBQ0tBR0UgPSAndmlld3MuY3FycydcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldFZpZXdzQ3Fyc1BhY2thZ2UgKHtnZXRDb25zb2xlLHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zLCB2aWV3c1N0b3JhZ2VQYWNrYWdlLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlLCBtdXRhdGlvbnNQYWNrYWdlfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zLCB2aWV3c1N0b3JhZ2VQYWNrYWdlLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlLCBtdXRhdGlvbnNQYWNrYWdlfSlcbiAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVWaWV3ICh7b2JqSWQsIGxvYWRTbmFwc2hvdCA9IHRydWUsIGxvYWRNdXRhdGlvbnMgPSB0cnVlLCBhZGRNdXRhdGlvbnMgPSBbXX0pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3VwZGF0ZVZpZXcnLCB7b2JqSWQsIGxvYWRTbmFwc2hvdCwgbG9hZE11dGF0aW9ucywgYWRkTXV0YXRpb25zIH0pXG4gICAgICAgIHZhciBsYXN0U25hcHNob3QgPSB7dGltZXN0YW1wOiAwLCBzdGF0ZToge319XG4gICAgICAgIHZhciBtdXRhdGlvbnMgPSBbXVxuICAgICAgICBpZiAobG9hZFNuYXBzaG90KSB7XG4gICAgICAgICAgdmFyIGxhc3RTbmFwc2hvdEZyb21EYiA9IGF3YWl0IHZpZXdzU25hcHNob3RzU3RvcmFnZVBhY2thZ2UuZmluZCh7cXVlcnk6IHtvYmpJZDogb2JqSWR9LCBzb3J0OiB7dGltZXN0YW1wOiAxfSwgbGltaXQ6IDEsIHN0YXJ0OiAwfSlcbiAgICAgICAgICBpZiAobGFzdFNuYXBzaG90RnJvbURiICYmIGxhc3RTbmFwc2hvdEZyb21EYlswXSkgbGFzdFNuYXBzaG90ID0gbGFzdFNuYXBzaG90RnJvbURiWzBdXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvYWRNdXRhdGlvbnMpbXV0YXRpb25zID0gYXdhaXQgbXV0YXRpb25zUGFja2FnZS5nZXRPYmpNdXRhdGlvbnMoe29iaklkLCBtaW5UaW1lc3RhbXA6IGxhc3RTbmFwc2hvdC50aW1lc3RhbXB9KVxuXG4gICAgICAgIG11dGF0aW9ucyA9IG11dGF0aW9ucy5jb25jYXQoYWRkTXV0YXRpb25zKVxuICAgICAgICAvLyBjbGVhciBhcnJheSwgcmVtb3ZlIGR1cGxpY2F0ZSBpZHNcbiAgICAgICAgbXV0YXRpb25zID0gUi51bmlxQnkoUi5wcm9wKCdfaWQnKSwgbXV0YXRpb25zKVxuICAgICAgICB2YXIgdXBkYXRlZFZpZXcgPSBhd2FpdCBtdXRhdGlvbnNQYWNrYWdlLmFwcGx5TXV0YXRpb25zKHtzdGF0ZTogbGFzdFNuYXBzaG90LnN0YXRlLCBtdXRhdGlvbnN9KVxuICAgICAgICAvLyBNRVRBIElORk8gX3ZpZXdcbiAgICAgICAgaWYgKHVwZGF0ZWRWaWV3Ll92aWV3QnVpbGRlZCkgZGVsZXRlIHVwZGF0ZWRWaWV3Ll92aWV3QnVpbGRlZFxuICAgICAgICBpZiAodXBkYXRlZFZpZXcuX3ZpZXdIYXNoKSBkZWxldGUgdXBkYXRlZFZpZXcuX3ZpZXdIYXNoXG4gICAgICAgIHVwZGF0ZWRWaWV3Ll92aWV3SGFzaCA9IHNob3J0aGFzaChKU09OLnN0cmluZ2lmeSh1cGRhdGVkVmlldykpXG4gICAgICAgIHVwZGF0ZWRWaWV3Ll92aWV3QnVpbGRlZCA9IERhdGUubm93KClcbiAgICAgICAgdmlld3NTdG9yYWdlUGFja2FnZS51cGRhdGUoe3F1ZXJpZXNBcnJheTogW3snX2lkJzogb2JqSWR9XSwgZGF0YUFycmF5OiBbdXBkYXRlZFZpZXddLCBpbnNlcnRJZk5vdEV4aXN0czogdHJ1ZX0pXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3VwZGF0ZWRWaWV3Jywge3VwZGF0ZWRWaWV3LCBtdXRhdGlvbnN9KVxuXG4gICAgICAgIGlmICh2aWV3c1NuYXBzaG90c01heE11dGF0aW9ucyA8IG11dGF0aW9ucyAmJiBtdXRhdGlvbnMubGVuZ3RoKSB7XG4gICAgICAgICAgYXdhaXQgdmlld3NTbmFwc2hvdHNTdG9yYWdlLmluc2VydCh7dGltZXN0YW1wOiBEYXRlLm5vdygpLCBzdGF0ZTogdXBkYXRlZFZpZXd9KSAvLyB1cGRhdGUgc25hcHNob3QgaWYgcmVxdWlyZWRcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdXBkYXRlZFZpZXdcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIENPTlNPTEUuZXJyb3IoZXJyb3IsIHtvYmpJZCwgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnN9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoUEFDS0FHRSArIGAgdXBkYXRlVmlld2ApXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICByZWZyZXNoVmlld3M6IGZ1bmN0aW9uIHJlZnJlc2hWaWV3cyAoe29iaklkcywgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnMgfSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWZyZXNoc1ZpZXdzJywge29iaklkcywgbG9hZFNuYXBzaG90LCBhZGRNdXRhdGlvbnMgfSlcbiAgICAgICAgZnVuY3Rpb24gc2luZ2xlVmlldyAob2JqSWQpIHtcbiAgICAgICAgICByZXR1cm4gdXBkYXRlVmlldyh7b2JqSWQsIGxvYWRTbmFwc2hvdCwgbG9hZE11dGF0aW9ucywgYWRkTXV0YXRpb25zfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoUi5tYXAoc2luZ2xlVmlldywgb2JqSWRzKSlcbiAgICAgIH0sXG4gICAgICBnZXQ6IHZpZXdzU3RvcmFnZVBhY2thZ2UuZ2V0LFxuICAgICAgZmluZDogdmlld3NTdG9yYWdlUGFja2FnZS5maW5kXG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGVycm9yVGhyb3coYGdldFZpZXdzQ3Fyc1BhY2thZ2UoKWAsIHtlcnJvcn0pXG4gIH1cbn1cbiJdfQ==