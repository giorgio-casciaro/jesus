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
            var updateItemView = function _callee(_ref) {
              var itemId = _ref.itemId,
                  _ref$loadSnapshot = _ref.loadSnapshot,
                  loadSnapshot = _ref$loadSnapshot === undefined ? true : _ref$loadSnapshot,
                  _ref$loadMutations = _ref.loadMutations,
                  loadMutations = _ref$loadMutations === undefined ? true : _ref$loadMutations,
                  _ref$addMutations = _ref.addMutations,
                  addMutations = _ref$addMutations === undefined ? [] : _ref$addMutations;
              var lastSnapshot, mutations, lastSnapshotFromDb, updatedView;
              return regeneratorRuntime.async(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;

                      DI.debug({ msg: 'updateItemView', context: PACKAGE, debug: { itemId: itemId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations } });
                      lastSnapshot = { timestamp: 0, state: {} };
                      mutations = [];

                      if (!loadSnapshot) {
                        _context.next = 9;
                        break;
                      }

                      _context.next = 7;
                      return regeneratorRuntime.awrap(DI.viewsSnapshotsStoragePackage.find({ query: { itemId: itemId }, sort: { timestamp: 1 }, limit: 1, start: 0 }));

                    case 7:
                      lastSnapshotFromDb = _context.sent;

                      if (lastSnapshotFromDb && lastSnapshotFromDb[0]) lastSnapshot = lastSnapshotFromDb[0];

                    case 9:
                      if (!loadMutations) {
                        _context.next = 13;
                        break;
                      }

                      _context.next = 12;
                      return regeneratorRuntime.awrap(DI.mutationsPackage.getItemMutations({ itemId: itemId, minTimestamp: lastSnapshot.timestamp }));

                    case 12:
                      mutations = _context.sent;

                    case 13:

                      mutations = mutations.concat(addMutations);
                      // clear array, remove duplicate ids
                      mutations = R.uniqBy(R.prop('_id'), mutations);
                      _context.next = 17;
                      return regeneratorRuntime.awrap(DI.mutationsPackage.applyMutations({ state: lastSnapshot.state, mutations: mutations }));

                    case 17:
                      updatedView = _context.sent;

                      DI.viewsStoragePackage.update({ queriesArray: [{ '_id': itemId }], dataArray: [updatedView], insertIfNotExists: true });
                      DI.debug({ msg: 'updatedView', context: PACKAGE, debug: { updatedView: updatedView, mutations: mutations } });

                      if (!(DI.snapshotsMaxMutations < mutations && mutations.length)) {
                        _context.next = 23;
                        break;
                      }

                      _context.next = 23;
                      return regeneratorRuntime.awrap(DI.viewsSnapshotsStorage.insert({ timestamp: Date.now(), state: updatedView }));

                    case 23:
                      return _context.abrupt('return', true);

                    case 26:
                      _context.prev = 26;
                      _context.t0 = _context['catch'](0);

                      DI.throwError(PACKAGE + ' updateItemView(args)', _context.t0, { itemId: itemId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations });

                    case 29:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this, [[0, 26]]);
            };

            var PACKAGE = 'views.cqrs';
            var getValuePromise = require('./jesus').getValuePromise;
            var checkRequired = require('./jesus').checkRequired;
            CONFIG = checkRequired(CONFIG, ['viewsSnapshotsMaxMutations'], PACKAGE);
            DI = checkRequired(DI, ['viewsStoragePackage', 'viewsSnapshotsStoragePackage', 'mutationsPackage', 'throwError', 'log', 'debug'], PACKAGE);

            return {
              v: {
                refreshItemsViews: function refreshItemsViews(_ref2) {
                  var itemsIds = _ref2.itemsIds,
                      loadSnapshot = _ref2.loadSnapshot,
                      loadMutations = _ref2.loadMutations,
                      addMutations = _ref2.addMutations;

                  DI.debug({ msg: 'refreshItemsViews', context: PACKAGE, debug: { itemsIds: itemsIds, loadSnapshot: loadSnapshot, addMutations: addMutations } });
                  function singleItemView(itemId, index) {
                    var checkedMutations = addMutations && addMutations[index] ? addMutations[index] : [];
                    return updateItemView({ itemId: itemId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: checkedMutations });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzLmNxcnMuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiamVzdXMiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJhcHBseSIsImFyZ3VtZW50cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRWaWV3c0NxcnNQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJ1cGRhdGVJdGVtVmlldyIsIml0ZW1JZCIsImxvYWRTbmFwc2hvdCIsImxvYWRNdXRhdGlvbnMiLCJhZGRNdXRhdGlvbnMiLCJtc2ciLCJjb250ZXh0IiwiUEFDS0FHRSIsImxhc3RTbmFwc2hvdCIsInRpbWVzdGFtcCIsInN0YXRlIiwibXV0YXRpb25zIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSIsImZpbmQiLCJxdWVyeSIsInNvcnQiLCJsaW1pdCIsInN0YXJ0IiwibGFzdFNuYXBzaG90RnJvbURiIiwibXV0YXRpb25zUGFja2FnZSIsImdldEl0ZW1NdXRhdGlvbnMiLCJtaW5UaW1lc3RhbXAiLCJjb25jYXQiLCJ1bmlxQnkiLCJwcm9wIiwiYXBwbHlNdXRhdGlvbnMiLCJ1cGRhdGVkVmlldyIsInZpZXdzU3RvcmFnZVBhY2thZ2UiLCJ1cGRhdGUiLCJxdWVyaWVzQXJyYXkiLCJkYXRhQXJyYXkiLCJpbnNlcnRJZk5vdEV4aXN0cyIsInNuYXBzaG90c01heE11dGF0aW9ucyIsImxlbmd0aCIsInZpZXdzU25hcHNob3RzU3RvcmFnZSIsImluc2VydCIsIkRhdGUiLCJub3ciLCJ0aHJvd0Vycm9yIiwiZ2V0VmFsdWVQcm9taXNlIiwiY2hlY2tSZXF1aXJlZCIsInJlZnJlc2hJdGVtc1ZpZXdzIiwiaXRlbXNJZHMiLCJzaW5nbGVJdGVtVmlldyIsImluZGV4IiwiY2hlY2tlZE11dGF0aW9ucyIsIlByb21pc2UiLCJhbGwiLCJhZGRJbmRleCIsIm1hcCIsImdldCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0E7QUFDQTtBQUNBLElB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d0JBQUlDLG1CQUFvQnpDLGdCQUFnQkEsYUFBYXdDLEtBQWIsQ0FBakIsR0FBd0N4QyxhQUFhd0MsS0FBYixDQUF4QyxHQUE4RCxFQUFyRjtBQUNBLDJCQUFPNUMsZUFBZSxFQUFDQyxjQUFELEVBQVNDLDBCQUFULEVBQXVCQyw0QkFBdkIsRUFBc0NDLGNBQWN5QyxnQkFBcEQsRUFBZixDQUFQO0FBQ0Q7QUFDRCx5QkFBT0MsUUFBUUMsR0FBUixDQUFZNUQsRUFBRTZELFFBQUYsQ0FBVzdELEVBQUU4RCxHQUFiLEVBQWtCTixjQUFsQixFQUFrQ0QsUUFBbEMsQ0FBWixDQUFQO0FBQ0QsaUJBUkk7QUFTTFEscUJBQUtuRCxHQUFHNEIsbUJBQUgsQ0FBdUJ1QjtBQVR2QjtBQUFQO0FBbENhOztBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBOENibkQsYUFBR3VDLFVBQUgsQ0FBYyxpQ0FBZDs7QUE5Q2E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoidmlld3MuY3Fycy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbi8vIHZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG4vLyB2YXIgZnMgPSByZXF1aXJlKCdmcycpXG52YXIgamVzdXMgPSByZXF1aXJlKCcuL2plc3VzJylcbmZ1bmN0aW9uIGRlYnVnICgpIHtcbiAgY29uc29sZS5sb2coJ1xcdTAwMWJbMTszM20nICtcbiAgICAnPENXUlMgVklFV1M+JyArXG4gICAgJ1xcdTAwMWJbMG0nKVxuICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0Vmlld3NDcXJzUGFja2FnZSAoQ09ORklHLCBESSkge1xuICB0cnkge1xuICAgIGNvbnN0IFBBQ0tBR0UgPSAndmlld3MuY3FycydcbiAgICBjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG4gICAgY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG4gICAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFsndmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnMnXSwgUEFDS0FHRSlcbiAgICBESSA9IGNoZWNrUmVxdWlyZWQoREksIFsndmlld3NTdG9yYWdlUGFja2FnZScsICd2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlJywgJ211dGF0aW9uc1BhY2thZ2UnLCAndGhyb3dFcnJvcicsICdsb2cnLCAnZGVidWcnXSwgUEFDS0FHRSlcblxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUl0ZW1WaWV3ICh7aXRlbUlkLCBsb2FkU25hcHNob3QgPSB0cnVlLCBsb2FkTXV0YXRpb25zID0gdHJ1ZSwgYWRkTXV0YXRpb25zID0gW119KSB7XG4gICAgICB0cnkge1xuICAgICAgICBESS5kZWJ1Zyh7bXNnOiAndXBkYXRlSXRlbVZpZXcnLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge2l0ZW1JZCwgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnN9fSlcbiAgICAgICAgdmFyIGxhc3RTbmFwc2hvdCA9IHt0aW1lc3RhbXA6IDAsIHN0YXRlOiB7fX1cbiAgICAgICAgdmFyIG11dGF0aW9ucyA9IFtdXG4gICAgICAgIGlmIChsb2FkU25hcHNob3QpIHtcbiAgICAgICAgICB2YXIgbGFzdFNuYXBzaG90RnJvbURiID0gYXdhaXQgREkudmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZS5maW5kKHtxdWVyeToge2l0ZW1JZDogaXRlbUlkfSwgc29ydDoge3RpbWVzdGFtcDogMX0sIGxpbWl0OiAxLCBzdGFydDogMH0pXG4gICAgICAgICAgaWYgKGxhc3RTbmFwc2hvdEZyb21EYiAmJiBsYXN0U25hcHNob3RGcm9tRGJbMF0pIGxhc3RTbmFwc2hvdCA9IGxhc3RTbmFwc2hvdEZyb21EYlswXVxuICAgICAgICB9XG4gICAgICAgIGlmIChsb2FkTXV0YXRpb25zKW11dGF0aW9ucyA9IGF3YWl0IERJLm11dGF0aW9uc1BhY2thZ2UuZ2V0SXRlbU11dGF0aW9ucyh7aXRlbUlkLCBtaW5UaW1lc3RhbXA6IGxhc3RTbmFwc2hvdC50aW1lc3RhbXB9KVxuXG4gICAgICAgIG11dGF0aW9ucyA9IG11dGF0aW9ucy5jb25jYXQoYWRkTXV0YXRpb25zKVxuICAgICAgICAvLyBjbGVhciBhcnJheSwgcmVtb3ZlIGR1cGxpY2F0ZSBpZHNcbiAgICAgICAgbXV0YXRpb25zID0gUi51bmlxQnkoUi5wcm9wKCdfaWQnKSwgbXV0YXRpb25zKVxuICAgICAgICB2YXIgdXBkYXRlZFZpZXcgPSBhd2FpdCBESS5tdXRhdGlvbnNQYWNrYWdlLmFwcGx5TXV0YXRpb25zKHtzdGF0ZTogbGFzdFNuYXBzaG90LnN0YXRlLCBtdXRhdGlvbnN9KVxuICAgICAgICBESS52aWV3c1N0b3JhZ2VQYWNrYWdlLnVwZGF0ZSh7cXVlcmllc0FycmF5OiBbeydfaWQnOiBpdGVtSWR9XSwgZGF0YUFycmF5OiBbdXBkYXRlZFZpZXddLCBpbnNlcnRJZk5vdEV4aXN0czogdHJ1ZX0pXG4gICAgICAgIERJLmRlYnVnKHttc2c6ICd1cGRhdGVkVmlldycsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7dXBkYXRlZFZpZXcsIG11dGF0aW9uc319KVxuXG4gICAgICAgIGlmIChESS5zbmFwc2hvdHNNYXhNdXRhdGlvbnMgPCBtdXRhdGlvbnMgJiYgbXV0YXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgIGF3YWl0IERJLnZpZXdzU25hcHNob3RzU3RvcmFnZS5pbnNlcnQoe3RpbWVzdGFtcDogRGF0ZS5ub3coKSwgc3RhdGU6IHVwZGF0ZWRWaWV3fSkgLy8gdXBkYXRlIHNuYXBzaG90IGlmIHJlcXVpcmVkXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIERJLnRocm93RXJyb3IoUEFDS0FHRSArICcgdXBkYXRlSXRlbVZpZXcoYXJncyknLCBlcnJvciwge2l0ZW1JZCwgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnN9KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgcmVmcmVzaEl0ZW1zVmlld3M6IGZ1bmN0aW9uIHJlZnJlc2hJdGVtc1ZpZXdzICh7aXRlbXNJZHMsIGxvYWRTbmFwc2hvdCwgbG9hZE11dGF0aW9ucywgYWRkTXV0YXRpb25zIH0pIHtcbiAgICAgICAgREkuZGVidWcoe21zZzogJ3JlZnJlc2hJdGVtc1ZpZXdzJywgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtpdGVtc0lkcywgbG9hZFNuYXBzaG90LCBhZGRNdXRhdGlvbnN9fSlcbiAgICAgICAgZnVuY3Rpb24gc2luZ2xlSXRlbVZpZXcgKGl0ZW1JZCwgaW5kZXgpIHtcbiAgICAgICAgICB2YXIgY2hlY2tlZE11dGF0aW9ucyA9IChhZGRNdXRhdGlvbnMgJiYgYWRkTXV0YXRpb25zW2luZGV4XSkgPyBhZGRNdXRhdGlvbnNbaW5kZXhdIDogW11cbiAgICAgICAgICByZXR1cm4gdXBkYXRlSXRlbVZpZXcoe2l0ZW1JZCwgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnM6IGNoZWNrZWRNdXRhdGlvbnN9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChSLmFkZEluZGV4KFIubWFwKShzaW5nbGVJdGVtVmlldywgaXRlbXNJZHMpKVxuICAgICAgfSxcbiAgICAgIGdldDogREkudmlld3NTdG9yYWdlUGFja2FnZS5nZXRcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0Vmlld3NDcXJzUGFja2FnZShDT05GSUcsIERJKScsIGVycm9yKVxuICB9XG59XG4iXX0=