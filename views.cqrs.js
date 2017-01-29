'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
// var path = require('path')
// var fs = require('fs')
var jesus = require('./jesus');
function debug() {
  console.log('\x1B[1;33m' + '<CWRS VIEWS>' + '\x1B[0m');
  console.log.apply(console, arguments);
}

module.exports = function getViewsCqrsPackage(CONFIG, DI) {
  var _ret;

  return regeneratorRuntime.async(function getViewsCqrsPackage$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;

          _ret = function () {
            var updateEntityView = function _callee(itemId) {
              var loadSnapshot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
              var newMutations = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
              var lastSnapshot, lastSnapshotFromDb, updatedView;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;

                      if (!loadSnapshot) {
                        _context.next = 6;
                        break;
                      }

                      _context.next = 4;
                      return regeneratorRuntime.awrap(DI.viewsSnapshotsStoragePackage.find({ itemId: itemId }, { timestamp: 1 }, 0, 1));

                    case 4:
                      lastSnapshotFromDb = _context.sent;

                      if (lastSnapshotFromDb && lastSnapshotFromDb[0]) lastSnapshot = lastSnapshotFromDb[0];

                    case 6:
                      if (!lastSnapshot) lastSnapshot = { timestamp: 0, state: {} };

                      if (!(newMutations === false)) {
                        _context.next = 11;
                        break;
                      }

                      _context.next = 10;
                      return regeneratorRuntime.awrap(DI.mutationsPackage.getEntityMutations({ itemId: itemId, minTimestamp: lastSnapshot.timestamp }));

                    case 10:
                      newMutations = _context.sent;

                    case 11:
                      _context.next = 13;
                      return regeneratorRuntime.awrap(DI.mutationsPackage.applyMutations({ state: lastSnapshot.state, mutations: newMutations }));

                    case 13:
                      updatedView = _context.sent;

                      DI.viewsStoragePackage.update({ queriesArray: [{ '_id': itemId }], dataArray: [updatedView], insertIfNotExists: true });
                      DI.debug({ msg: 'updatedView', context: PACKAGE, debug: { updatedView: updatedView } });

                      if (!(DI.snapshotsMaxMutations < newMutations && newMutations.length)) {
                        _context.next = 19;
                        break;
                      }

                      _context.next = 19;
                      return regeneratorRuntime.awrap(DI.viewsSnapshotsStorage.insert({ timestamp: Date.now(), state: updatedView }));

                    case 19:
                      return _context.abrupt('return', true);

                    case 22:
                      _context.prev = 22;
                      _context.t0 = _context['catch'](0);

                      DI.throwError(PACKAGE + ' updateEntityView(args)', _context.t0, { itemId: itemId, loadSnapshot: loadSnapshot, newMutations: newMutations });

                    case 25:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this, [[0, 22]]);
            };

            var PACKAGE = 'views.cqrs';
            var getValuePromise = require('./jesus').getValuePromise;
            var checkRequired = require('./jesus').checkRequired;
            CONFIG = checkRequired(CONFIG, ['viewsSnapshotsMaxMutations'], PACKAGE);
            DI = checkRequired(DI, ['viewsStoragePackage', 'viewsSnapshotsStoragePackage', 'mutationsPackage', 'error', 'log', 'debug'], PACKAGE);

            return {
              v: {
                refreshItemsViews: function refreshItemsViews(_ref) {
                  var itemsIds = _ref.itemsIds,
                      _ref$loadSnapshot = _ref.loadSnapshot,
                      loadSnapshot = _ref$loadSnapshot === undefined ? false : _ref$loadSnapshot,
                      _ref$itemsMutations = _ref.itemsMutations,
                      itemsMutations = _ref$itemsMutations === undefined ? false : _ref$itemsMutations;

                  function singleItemView(itemId, index) {
                    var newMutations = itemsMutations && itemsMutations[index] ? itemsMutations[index] : false;
                    return updateEntityView(itemId, loadSnapshot, newMutations);
                  }
                  return Promise.all(R.addIndex(R.map)(singleItemView, itemsIds));
                },
                get: DI.viewsStoragePackage.get
              }
            };
          }();

          if (!((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object")) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt('return', _ret.v);

        case 4:
          _context2.next = 9;
          break;

        case 6:
          _context2.prev = 6;
          _context2.t0 = _context2['catch'](0);

          DI.throwError('getViewsCqrsPackage(CONFIG, DI)', _context2.t0);

        case 9:
        case 'end':
          return _context2.stop();
      }
    }
  }, null, this, [[0, 6]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzLmNxcnMuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiamVzdXMiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJhcHBseSIsImFyZ3VtZW50cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRWaWV3c0NxcnNQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJ1cGRhdGVFbnRpdHlWaWV3IiwiaXRlbUlkIiwibG9hZFNuYXBzaG90IiwibmV3TXV0YXRpb25zIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSIsImZpbmQiLCJ0aW1lc3RhbXAiLCJsYXN0U25hcHNob3RGcm9tRGIiLCJsYXN0U25hcHNob3QiLCJzdGF0ZSIsIm11dGF0aW9uc1BhY2thZ2UiLCJnZXRFbnRpdHlNdXRhdGlvbnMiLCJtaW5UaW1lc3RhbXAiLCJhcHBseU11dGF0aW9ucyIsIm11dGF0aW9ucyIsInVwZGF0ZWRWaWV3Iiwidmlld3NTdG9yYWdlUGFja2FnZSIsInVwZGF0ZSIsInF1ZXJpZXNBcnJheSIsImRhdGFBcnJheSIsImluc2VydElmTm90RXhpc3RzIiwibXNnIiwiY29udGV4dCIsIlBBQ0tBR0UiLCJzbmFwc2hvdHNNYXhNdXRhdGlvbnMiLCJsZW5ndGgiLCJ2aWV3c1NuYXBzaG90c1N0b3JhZ2UiLCJpbnNlcnQiLCJEYXRlIiwibm93IiwidGhyb3dFcnJvciIsImdldFZhbHVlUHJvbWlzZSIsImNoZWNrUmVxdWlyZWQiLCJyZWZyZXNoSXRlbXNWaWV3cyIsIml0ZW1zSWRzIiwiaXRlbXNNdXRhdGlvbnMiLCJzaW5nbGVJdGVtVmlldyIsImluZGV4IiwiUHJvbWlzZSIsImFsbCIsImFkZEluZGV4IiwibWFwIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQTtBQUNBO0FBQ0EsSUFBSUMsUUFBUUQsUUFBUSxTQUFSLENBQVo7QUFDQSxTQUFTRSxLQUFULEdBQWtCO0FBQ2hCQyxVQUFRQyxHQUFSLENBQVks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S0FBckYsRUFBNEYsT0FBNUYsQ0FBbEIsRUFBd0h3QixPQUF4SCxDQUFMOztBQTJCQTtBQUFBLGlCQUFPO0FBQ0xVLG1DQUFtQixTQUFTQSxpQkFBVCxPQUFzRjtBQUFBLHNCQUF6REMsUUFBeUQsUUFBekRBLFFBQXlEO0FBQUEsK0NBQS9DaEMsWUFBK0M7QUFBQSxzQkFBL0NBLFlBQStDLHFDQUFoQyxLQUFnQztBQUFBLGlEQUF6QmlDLGNBQXlCO0FBQUEsc0JBQXpCQSxjQUF5Qix1Q0FBUixLQUFROztBQUN2RywyQkFBU0MsY0FBVCxDQUF5Qm5DLE1BQXpCLEVBQWlDb0MsS0FBakMsRUFBd0M7QUFDdEMsd0JBQUlsQyxlQUFnQmdDLGtCQUFrQkEsZUFBZUUsS0FBZixDQUFuQixHQUE0Q0YsZUFBZUUsS0FBZixDQUE1QyxHQUFvRSxLQUF2RjtBQUNBLDJCQUFPckMsaUJBQWlCQyxNQUFqQixFQUF5QkMsWUFBekIsRUFBdUNDLFlBQXZDLENBQVA7QUFDRDtBQUNELHlCQUFPbUMsUUFBUUMsR0FBUixDQUFZcEQsRUFBRXFELFFBQUYsQ0FBV3JELEVBQUVzRCxHQUFiLEVBQWtCTCxjQUFsQixFQUFrQ0YsUUFBbEMsQ0FBWixDQUFQO0FBQ0QsaUJBUEk7QUFRTFEscUJBQUszQyxHQUFHaUIsbUJBQUgsQ0FBdUIwQjtBQVJ2QjtBQUFQO0FBakNhOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBNENiM0MsYUFBRytCLFVBQUgsQ0FBYyxpQ0FBZDs7QUE1Q2E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoidmlld3MuY3Fycy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbi8vIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4vLyB2YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgamVzdXMgPSByZXF1aXJlKCcuL2plc3VzJylcbmZ1bmN0aW9uIGRlYnVnICgpIHtcbiAgY29uc29sZS5sb2coJ1xcdTAwMWJbMTszM20nICtcbiAgICAnPENXUlMgVklFV1M+JyArXG4gICAgJ1xcdTAwMWJbMG0nKVxuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0Vmlld3NDcXJzUGFja2FnZSAoQ09ORklHLCBESSkge1xuICB0cnkge1xuICAgIGNvbnN0IFBBQ0tBR0UgPSAndmlld3MuY3FycydcbiAgICBjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG4gICAgY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG4gICAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFsndmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnMnXSwgUEFDS0FHRSlcbiAgICBESSA9IGNoZWNrUmVxdWlyZWQoREksIFsndmlld3NTdG9yYWdlUGFja2FnZScsICd2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlJywgJ211dGF0aW9uc1BhY2thZ2UnLCAnZXJyb3InLCAnbG9nJywgJ2RlYnVnJ10sIFBBQ0tBR0UpXG5cbiAgICBhc3luYyBmdW5jdGlvbiB1cGRhdGVFbnRpdHlWaWV3IChpdGVtSWQsIGxvYWRTbmFwc2hvdCA9IHRydWUsIG5ld011dGF0aW9ucyA9IGZhbHNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB2YXIgbGFzdFNuYXBzaG90XG4gICAgICAgIGlmIChsb2FkU25hcHNob3QpIHtcbiAgICAgICAgICB2YXIgbGFzdFNuYXBzaG90RnJvbURiID0gYXdhaXQgREkudmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZS5maW5kKHtpdGVtSWQ6IGl0ZW1JZH0sIHt0aW1lc3RhbXA6IDF9LCAwLCAxKVxuICAgICAgICAgIGlmIChsYXN0U25hcHNob3RGcm9tRGIgJiYgbGFzdFNuYXBzaG90RnJvbURiWzBdKSBsYXN0U25hcHNob3QgPSBsYXN0U25hcHNob3RGcm9tRGJbMF1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWxhc3RTbmFwc2hvdClsYXN0U25hcHNob3QgPSB7dGltZXN0YW1wOiAwLCBzdGF0ZToge319XG5cbiAgICAgICAgaWYgKG5ld011dGF0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBuZXdNdXRhdGlvbnMgPSBhd2FpdCBESS5tdXRhdGlvbnNQYWNrYWdlLmdldEVudGl0eU11dGF0aW9ucyh7aXRlbUlkLCBtaW5UaW1lc3RhbXA6IGxhc3RTbmFwc2hvdC50aW1lc3RhbXB9KVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHVwZGF0ZWRWaWV3ID0gYXdhaXQgREkubXV0YXRpb25zUGFja2FnZS5hcHBseU11dGF0aW9ucyh7c3RhdGU6IGxhc3RTbmFwc2hvdC5zdGF0ZSwgbXV0YXRpb25zOiBuZXdNdXRhdGlvbnN9KVxuICAgICAgICBESS52aWV3c1N0b3JhZ2VQYWNrYWdlLnVwZGF0ZSh7cXVlcmllc0FycmF5OiBbeydfaWQnOiBpdGVtSWR9XSwgZGF0YUFycmF5OiBbdXBkYXRlZFZpZXddLCBpbnNlcnRJZk5vdEV4aXN0czogdHJ1ZX0pXG4gICAgICAgIERJLmRlYnVnKHttc2c6ICd1cGRhdGVkVmlldycsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7dXBkYXRlZFZpZXd9fSlcblxuICAgICAgICBpZiAoREkuc25hcHNob3RzTWF4TXV0YXRpb25zIDwgbmV3TXV0YXRpb25zICYmIG5ld011dGF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICBhd2FpdCBESS52aWV3c1NuYXBzaG90c1N0b3JhZ2UuaW5zZXJ0KHt0aW1lc3RhbXA6IERhdGUubm93KCksIHN0YXRlOiB1cGRhdGVkVmlld30pIC8vIHVwZGF0ZSBzbmFwc2hvdCBpZiByZXF1aXJlZFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBESS50aHJvd0Vycm9yKFBBQ0tBR0UgKyAnIHVwZGF0ZUVudGl0eVZpZXcoYXJncyknLCBlcnJvciwge2l0ZW1JZCwgbG9hZFNuYXBzaG90LCBuZXdNdXRhdGlvbnN9KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcmVmcmVzaEl0ZW1zVmlld3M6IGZ1bmN0aW9uIHJlZnJlc2hJdGVtc1ZpZXdzICh7aXRlbXNJZHMsIGxvYWRTbmFwc2hvdCA9IGZhbHNlLCBpdGVtc011dGF0aW9ucyA9IGZhbHNlfSkge1xuICAgICAgICBmdW5jdGlvbiBzaW5nbGVJdGVtVmlldyAoaXRlbUlkLCBpbmRleCkge1xuICAgICAgICAgIHZhciBuZXdNdXRhdGlvbnMgPSAoaXRlbXNNdXRhdGlvbnMgJiYgaXRlbXNNdXRhdGlvbnNbaW5kZXhdKSA/IGl0ZW1zTXV0YXRpb25zW2luZGV4XSA6IGZhbHNlXG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZUVudGl0eVZpZXcoaXRlbUlkLCBsb2FkU25hcHNob3QsIG5ld011dGF0aW9ucylcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoUi5hZGRJbmRleChSLm1hcCkoc2luZ2xlSXRlbVZpZXcsIGl0ZW1zSWRzKSlcbiAgICAgIH0sXG4gICAgICBnZXQ6IERJLnZpZXdzU3RvcmFnZVBhY2thZ2UuZ2V0XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIERJLnRocm93RXJyb3IoJ2dldFZpZXdzQ3Fyc1BhY2thZ2UoQ09ORklHLCBESSknLCBlcnJvcilcbiAgfVxufVxuIl19