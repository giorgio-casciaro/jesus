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
  var serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      viewsSnapshotsMaxMutations = _ref.viewsSnapshotsMaxMutations,
      viewsStoragePackage = _ref.viewsStoragePackage,
      viewsSnapshotsStoragePackage = _ref.viewsSnapshotsStoragePackage,
      mutationsPackage = _ref.mutationsPackage;

  var LOG, errorThrow, _ret;

  return regeneratorRuntime.async(function getViewsCqrsPackage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE);
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

                      LOG.debug('updateView', { objId: objId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations });
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
                      LOG.debug('updatedView', { updatedView: updatedView, mutations: mutations });

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

                      LOG.error(_context.t0, { objId: objId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations });
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

                  LOG.debug('refreshsViews', { objIds: objIds, loadSnapshot: loadSnapshot, addMutations: addMutations });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzLmNxcnMuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2hvcnRoYXNoIiwidW5pcXVlIiwiamVzdXMiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRWaWV3c0NxcnNQYWNrYWdlIiwic2VydmljZU5hbWUiLCJzZXJ2aWNlSWQiLCJ2aWV3c1NuYXBzaG90c01heE11dGF0aW9ucyIsInZpZXdzU3RvcmFnZVBhY2thZ2UiLCJ2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlIiwibXV0YXRpb25zUGFja2FnZSIsIkxPRyIsImVycm9yVGhyb3ciLCJ1cGRhdGVWaWV3Iiwib2JqSWQiLCJsb2FkU25hcHNob3QiLCJsb2FkTXV0YXRpb25zIiwiYWRkTXV0YXRpb25zIiwiZGVidWciLCJsYXN0U25hcHNob3QiLCJ0aW1lc3RhbXAiLCJzdGF0ZSIsIm11dGF0aW9ucyIsImZpbmQiLCJxdWVyeSIsInNvcnQiLCJsaW1pdCIsInN0YXJ0IiwibGFzdFNuYXBzaG90RnJvbURiIiwiZ2V0T2JqTXV0YXRpb25zIiwibWluVGltZXN0YW1wIiwiY29uY2F0IiwidW5pcUJ5IiwicHJvcCIsImFwcGx5TXV0YXRpb25zIiwidXBkYXRlZFZpZXciLCJfdmlld0J1aWxkZWQiLCJfdmlld0hhc2giLCJKU09OIiwic3RyaW5naWZ5IiwiRGF0ZSIsIm5vdyIsInVwZGF0ZSIsInF1ZXJpZXNBcnJheSIsImRhdGFBcnJheSIsImluc2VydElmTm90RXhpc3RzIiwibGVuZ3RoIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlIiwiaW5zZXJ0IiwiZXJyb3IiLCJFcnJvciIsInJlZnJlc2hWaWV3cyIsIm9iaklkcyIsInNpbmdsZVZpZXciLCJQcm9taXNlIiwiYWxsIiwibWFwIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJQyxZQUFZRCxRQUFRLFdBQVIsRUFBcUJFLE1B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QUFVLGVBQVYsRUFBMkIsRUFBQ2tDLGNBQUQsRUFBU3JDLDBCQUFULEVBQXVCRSwwQkFBdkIsRUFBM0I7QUFDQSwyQkFBU29DLFVBQVQsQ0FBcUJ2QyxLQUFyQixFQUE0QjtBQUMxQiwyQkFBT0QsV0FBVyxFQUFDQyxZQUFELEVBQVFDLDBCQUFSLEVBQXNCQyw0QkFBdEIsRUFBcUNDLDBCQUFyQyxFQUFYLENBQVA7QUFDRDtBQUNELHlCQUFPcUMsUUFBUUMsR0FBUixDQUFZNUQsRUFBRTZELEdBQUYsQ0FBTUgsVUFBTixFQUFrQkQsTUFBbEIsQ0FBWixDQUFQO0FBQ0QsaUJBUEk7QUFRTEsscUJBQUtqRCxvQkFBb0JpRCxHQVJwQjtBQVNMbEMsc0JBQU1mLG9CQUFvQmU7QUFUckI7QUFBUDtBQXJDYTs7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQWlEYlgsOENBQW9DLEVBQUNxQyxtQkFBRCxFQUFwQzs7QUFqRGE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoidmlld3MuY3Fycy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBzaG9ydGhhc2ggPSByZXF1aXJlKCdzaG9ydGhhc2gnKS51bmlxdWVcbi8vIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4vLyB2YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgamVzdXMgPSByZXF1aXJlKCcuL2plc3VzJylcbmNvbnN0IFBBQ0tBR0UgPSAndmlld3MuY3FycydcbmNvbnN0IGNoZWNrUmVxdWlyZWQgPSByZXF1aXJlKCcuL2plc3VzJykuY2hlY2tSZXF1aXJlZFxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldFZpZXdzQ3Fyc1BhY2thZ2UgKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCB2aWV3c1NuYXBzaG90c01heE11dGF0aW9ucywgdmlld3NTdG9yYWdlUGFja2FnZSwgdmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSwgbXV0YXRpb25zUGFja2FnZX0pIHtcbiAgdmFyIExPRyA9IHJlcXVpcmUoJy4vamVzdXMnKS5MT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zLCB2aWV3c1N0b3JhZ2VQYWNrYWdlLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlLCBtdXRhdGlvbnNQYWNrYWdlfSlcbiAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVWaWV3ICh7b2JqSWQsIGxvYWRTbmFwc2hvdCA9IHRydWUsIGxvYWRNdXRhdGlvbnMgPSB0cnVlLCBhZGRNdXRhdGlvbnMgPSBbXX0pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIExPRy5kZWJ1ZygndXBkYXRlVmlldycsIHtvYmpJZCwgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnMgfSlcbiAgICAgICAgdmFyIGxhc3RTbmFwc2hvdCA9IHt0aW1lc3RhbXA6IDAsIHN0YXRlOiB7fX1cbiAgICAgICAgdmFyIG11dGF0aW9ucyA9IFtdXG4gICAgICAgIGlmIChsb2FkU25hcHNob3QpIHtcbiAgICAgICAgICB2YXIgbGFzdFNuYXBzaG90RnJvbURiID0gYXdhaXQgdmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZS5maW5kKHtxdWVyeToge29iaklkOiBvYmpJZH0sIHNvcnQ6IHt0aW1lc3RhbXA6IDF9LCBsaW1pdDogMSwgc3RhcnQ6IDB9KVxuICAgICAgICAgIGlmIChsYXN0U25hcHNob3RGcm9tRGIgJiYgbGFzdFNuYXBzaG90RnJvbURiWzBdKSBsYXN0U25hcHNob3QgPSBsYXN0U25hcHNob3RGcm9tRGJbMF1cbiAgICAgICAgfVxuICAgICAgICBpZiAobG9hZE11dGF0aW9ucyltdXRhdGlvbnMgPSBhd2FpdCBtdXRhdGlvbnNQYWNrYWdlLmdldE9iak11dGF0aW9ucyh7b2JqSWQsIG1pblRpbWVzdGFtcDogbGFzdFNuYXBzaG90LnRpbWVzdGFtcH0pXG5cbiAgICAgICAgbXV0YXRpb25zID0gbXV0YXRpb25zLmNvbmNhdChhZGRNdXRhdGlvbnMpXG4gICAgICAgIC8vIGNsZWFyIGFycmF5LCByZW1vdmUgZHVwbGljYXRlIGlkc1xuICAgICAgICBtdXRhdGlvbnMgPSBSLnVuaXFCeShSLnByb3AoJ19pZCcpLCBtdXRhdGlvbnMpXG4gICAgICAgIHZhciB1cGRhdGVkVmlldyA9IGF3YWl0IG11dGF0aW9uc1BhY2thZ2UuYXBwbHlNdXRhdGlvbnMoe3N0YXRlOiBsYXN0U25hcHNob3Quc3RhdGUsIG11dGF0aW9uc30pXG4gICAgICAgIC8vIE1FVEEgSU5GTyBfdmlld1xuICAgICAgICBpZiAodXBkYXRlZFZpZXcuX3ZpZXdCdWlsZGVkKSBkZWxldGUgdXBkYXRlZFZpZXcuX3ZpZXdCdWlsZGVkXG4gICAgICAgIGlmICh1cGRhdGVkVmlldy5fdmlld0hhc2gpIGRlbGV0ZSB1cGRhdGVkVmlldy5fdmlld0hhc2hcbiAgICAgICAgdXBkYXRlZFZpZXcuX3ZpZXdIYXNoID0gc2hvcnRoYXNoKEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRWaWV3KSlcbiAgICAgICAgdXBkYXRlZFZpZXcuX3ZpZXdCdWlsZGVkID0gRGF0ZS5ub3coKVxuICAgICAgICB2aWV3c1N0b3JhZ2VQYWNrYWdlLnVwZGF0ZSh7cXVlcmllc0FycmF5OiBbeydfaWQnOiBvYmpJZH1dLCBkYXRhQXJyYXk6IFt1cGRhdGVkVmlld10sIGluc2VydElmTm90RXhpc3RzOiB0cnVlfSlcbiAgICAgICAgTE9HLmRlYnVnKCd1cGRhdGVkVmlldycsIHt1cGRhdGVkVmlldywgbXV0YXRpb25zfSlcblxuICAgICAgICBpZiAodmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnMgPCBtdXRhdGlvbnMgJiYgbXV0YXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgIGF3YWl0IHZpZXdzU25hcHNob3RzU3RvcmFnZS5pbnNlcnQoe3RpbWVzdGFtcDogRGF0ZS5ub3coKSwgc3RhdGU6IHVwZGF0ZWRWaWV3fSkgLy8gdXBkYXRlIHNuYXBzaG90IGlmIHJlcXVpcmVkXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVwZGF0ZWRWaWV3XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBMT0cuZXJyb3IoZXJyb3IsIHtvYmpJZCwgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnN9KVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoUEFDS0FHRSArIGAgdXBkYXRlVmlld2ApXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICByZWZyZXNoVmlld3M6IGZ1bmN0aW9uIHJlZnJlc2hWaWV3cyAoe29iaklkcywgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnMgfSkge1xuICAgICAgICBMT0cuZGVidWcoJ3JlZnJlc2hzVmlld3MnLCB7b2JqSWRzLCBsb2FkU25hcHNob3QsIGFkZE11dGF0aW9ucyB9KVxuICAgICAgICBmdW5jdGlvbiBzaW5nbGVWaWV3IChvYmpJZCkge1xuICAgICAgICAgIHJldHVybiB1cGRhdGVWaWV3KHtvYmpJZCwgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnN9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChSLm1hcChzaW5nbGVWaWV3LCBvYmpJZHMpKVxuICAgICAgfSxcbiAgICAgIGdldDogdmlld3NTdG9yYWdlUGFja2FnZS5nZXQsXG4gICAgICBmaW5kOiB2aWV3c1N0b3JhZ2VQYWNrYWdlLmZpbmRcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JUaHJvdyhgZ2V0Vmlld3NDcXJzUGFja2FnZSgpYCwge2Vycm9yfSlcbiAgfVxufVxuIl19