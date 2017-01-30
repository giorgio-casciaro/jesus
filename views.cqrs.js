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
                      //clear array, remove duplicate ids
                      mutations = R.uniqWith(R.prop("_id"), mutations);
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
            DI = checkRequired(DI, ['viewsStoragePackage', 'viewsSnapshotsStoragePackage', 'mutationsPackage', 'error', 'log', 'debug'], PACKAGE);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzLmNxcnMuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiamVzdXMiLCJkZWJ1ZyIsImNvbnNvbGUiLCJsb2ciLCJhcHBseSIsImFyZ3VtZW50cyIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRWaWV3c0NxcnNQYWNrYWdlIiwiQ09ORklHIiwiREkiLCJ1cGRhdGVJdGVtVmlldyIsIml0ZW1JZCIsImxvYWRTbmFwc2hvdCIsImxvYWRNdXRhdGlvbnMiLCJhZGRNdXRhdGlvbnMiLCJtc2ciLCJjb250ZXh0IiwiUEFDS0FHRSIsImxhc3RTbmFwc2hvdCIsInRpbWVzdGFtcCIsInN0YXRlIiwibXV0YXRpb25zIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSIsImZpbmQiLCJxdWVyeSIsInNvcnQiLCJsaW1pdCIsInN0YXJ0IiwibGFzdFNuYXBzaG90RnJvbURiIiwibXV0YXRpb25zUGFja2FnZSIsImdldEl0ZW1NdXRhdGlvbnMiLCJtaW5UaW1lc3RhbXAiLCJjb25jYXQiLCJ1bmlxV2l0aCIsInByb3AiLCJhcHBseU11dGF0aW9ucyIsInVwZGF0ZWRWaWV3Iiwidmlld3NTdG9yYWdlUGFja2FnZSIsInVwZGF0ZSIsInF1ZXJpZXNBcnJheSIsImRhdGFBcnJheSIsImluc2VydElmTm90RXhpc3RzIiwic25hcHNob3RzTWF4TXV0YXRpb25zIiwibGVuZ3RoIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlIiwiaW5zZXJ0IiwiRGF0ZSIsIm5vdyIsInRocm93RXJyb3IiLCJnZXRWYWx1ZVByb21pc2UiLCJjaGVja1JlcXVpcmVkIiwicmVmcmVzaEl0ZW1zVmlld3MiLCJpdGVtc0lkcyIsInNpbmdsZUl0ZW1WaWV3IiwiaW5kZXgiLCJjaGVja2VkTXV0YXRpb25zIiwiUHJvbWlzZSIsImFsbCIsImFkZEluZGV4IiwibWFwIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQTtBQUNBO0FBQ0Es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Qyx3QkFBSUMsbUJBQW9CekMsZ0JBQWdCQSxhQUFhd0MsS0FBYixDQUFqQixHQUF3Q3hDLGFBQWF3QyxLQUFiLENBQXhDLEdBQThELEVBQXJGO0FBQ0EsMkJBQU81QyxlQUFlLEVBQUNDLGNBQUQsRUFBU0MsMEJBQVQsRUFBdUJDLDRCQUF2QixFQUFzQ0MsY0FBYXlDLGdCQUFuRCxFQUFmLENBQVA7QUFDRDtBQUNELHlCQUFPQyxRQUFRQyxHQUFSLENBQVk1RCxFQUFFNkQsUUFBRixDQUFXN0QsRUFBRThELEdBQWIsRUFBa0JOLGNBQWxCLEVBQWtDRCxRQUFsQyxDQUFaLENBQVA7QUFDRCxpQkFSSTtBQVNMUSxxQkFBS25ELEdBQUc0QixtQkFBSCxDQUF1QnVCO0FBVHZCO0FBQVA7QUFsQ2E7O0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUE7QUFBQTs7QUE4Q2JuRCxhQUFHdUMsVUFBSCxDQUFjLGlDQUFkOztBQTlDYTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJ2aWV3cy5jcXJzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuLy8gdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbi8vIHZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4vamVzdXMnKVxuZnVuY3Rpb24gZGVidWcgKCkge1xuICBjb25zb2xlLmxvZygnXFx1MDAxYlsxOzMzbScgK1xuICAgICc8Q1dSUyBWSUVXUz4nICtcbiAgICAnXFx1MDAxYlswbScpXG4gIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cylcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBnZXRWaWV3c0NxcnNQYWNrYWdlIChDT05GSUcsIERJKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgUEFDS0FHRSA9ICd2aWV3cy5jcXJzJ1xuICAgIGNvbnN0IGdldFZhbHVlUHJvbWlzZSA9IHJlcXVpcmUoJy4vamVzdXMnKS5nZXRWYWx1ZVByb21pc2VcbiAgICBjb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbiAgICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWyd2aWV3c1NuYXBzaG90c01heE11dGF0aW9ucyddLCBQQUNLQUdFKVxuICAgIERJID0gY2hlY2tSZXF1aXJlZChESSwgWyd2aWV3c1N0b3JhZ2VQYWNrYWdlJywgJ3ZpZXdzU25hcHNob3RzU3RvcmFnZVBhY2thZ2UnLCAnbXV0YXRpb25zUGFja2FnZScsICdlcnJvcicsICdsb2cnLCAnZGVidWcnXSwgUEFDS0FHRSlcblxuICAgIGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUl0ZW1WaWV3ICh7aXRlbUlkLCBsb2FkU25hcHNob3QgPSB0cnVlLCBsb2FkTXV0YXRpb25zID0gdHJ1ZSwgYWRkTXV0YXRpb25zID0gW119KSB7XG4gICAgICB0cnkge1xuICAgICAgICBESS5kZWJ1Zyh7bXNnOiAndXBkYXRlSXRlbVZpZXcnLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge2l0ZW1JZCwgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnN9fSlcbiAgICAgICAgdmFyIGxhc3RTbmFwc2hvdCA9IHt0aW1lc3RhbXA6IDAsIHN0YXRlOiB7fX1cbiAgICAgICAgdmFyIG11dGF0aW9ucyA9IFtdXG4gICAgICAgIGlmIChsb2FkU25hcHNob3QpIHtcbiAgICAgICAgICB2YXIgbGFzdFNuYXBzaG90RnJvbURiID0gYXdhaXQgREkudmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZS5maW5kKHtxdWVyeToge2l0ZW1JZDogaXRlbUlkfSwgc29ydDoge3RpbWVzdGFtcDogMX0sIGxpbWl0OiAxLCBzdGFydDogMH0pXG4gICAgICAgICAgaWYgKGxhc3RTbmFwc2hvdEZyb21EYiAmJiBsYXN0U25hcHNob3RGcm9tRGJbMF0pIGxhc3RTbmFwc2hvdCA9IGxhc3RTbmFwc2hvdEZyb21EYlswXVxuICAgICAgICB9XG4gICAgICAgIGlmIChsb2FkTXV0YXRpb25zKW11dGF0aW9ucyA9IGF3YWl0IERJLm11dGF0aW9uc1BhY2thZ2UuZ2V0SXRlbU11dGF0aW9ucyh7aXRlbUlkLCBtaW5UaW1lc3RhbXA6IGxhc3RTbmFwc2hvdC50aW1lc3RhbXB9KVxuICAgICAgICBcbiAgICAgICAgbXV0YXRpb25zID0gbXV0YXRpb25zLmNvbmNhdChhZGRNdXRhdGlvbnMpXG4gICAgICAgIC8vY2xlYXIgYXJyYXksIHJlbW92ZSBkdXBsaWNhdGUgaWRzXG4gICAgICAgIG11dGF0aW9ucyA9IFIudW5pcVdpdGgoUi5wcm9wKFwiX2lkXCIpLG11dGF0aW9ucyk7XG4gICAgICAgIHZhciB1cGRhdGVkVmlldyA9IGF3YWl0IERJLm11dGF0aW9uc1BhY2thZ2UuYXBwbHlNdXRhdGlvbnMoe3N0YXRlOiBsYXN0U25hcHNob3Quc3RhdGUsIG11dGF0aW9uc30pXG4gICAgICAgIERJLnZpZXdzU3RvcmFnZVBhY2thZ2UudXBkYXRlKHtxdWVyaWVzQXJyYXk6IFt7J19pZCc6IGl0ZW1JZH1dLCBkYXRhQXJyYXk6IFt1cGRhdGVkVmlld10sIGluc2VydElmTm90RXhpc3RzOiB0cnVlfSlcbiAgICAgICAgREkuZGVidWcoe21zZzogJ3VwZGF0ZWRWaWV3JywgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHt1cGRhdGVkVmlldyxtdXRhdGlvbnN9fSlcblxuICAgICAgICBpZiAoREkuc25hcHNob3RzTWF4TXV0YXRpb25zIDwgbXV0YXRpb25zICYmIG11dGF0aW9ucy5sZW5ndGgpIHtcbiAgICAgICAgICBhd2FpdCBESS52aWV3c1NuYXBzaG90c1N0b3JhZ2UuaW5zZXJ0KHt0aW1lc3RhbXA6IERhdGUubm93KCksIHN0YXRlOiB1cGRhdGVkVmlld30pIC8vIHVwZGF0ZSBzbmFwc2hvdCBpZiByZXF1aXJlZFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBESS50aHJvd0Vycm9yKFBBQ0tBR0UgKyAnIHVwZGF0ZUl0ZW1WaWV3KGFyZ3MpJywgZXJyb3IsIHtpdGVtSWQsIGxvYWRTbmFwc2hvdCwgbG9hZE11dGF0aW9ucywgYWRkTXV0YXRpb25zfSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlZnJlc2hJdGVtc1ZpZXdzOiBmdW5jdGlvbiByZWZyZXNoSXRlbXNWaWV3cyAoe2l0ZW1zSWRzLCBsb2FkU25hcHNob3QsIGxvYWRNdXRhdGlvbnMsIGFkZE11dGF0aW9ucyB9KSB7XG4gICAgICAgIERJLmRlYnVnKHttc2c6ICdyZWZyZXNoSXRlbXNWaWV3cycsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7aXRlbXNJZHMsIGxvYWRTbmFwc2hvdCwgYWRkTXV0YXRpb25zfX0pXG4gICAgICAgIGZ1bmN0aW9uIHNpbmdsZUl0ZW1WaWV3IChpdGVtSWQsIGluZGV4KSB7XG4gICAgICAgICAgdmFyIGNoZWNrZWRNdXRhdGlvbnMgPSAoYWRkTXV0YXRpb25zICYmIGFkZE11dGF0aW9uc1tpbmRleF0pID8gYWRkTXV0YXRpb25zW2luZGV4XSA6IFtdXG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZUl0ZW1WaWV3KHtpdGVtSWQsIGxvYWRTbmFwc2hvdCwgbG9hZE11dGF0aW9ucywgYWRkTXV0YXRpb25zOmNoZWNrZWRNdXRhdGlvbnN9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChSLmFkZEluZGV4KFIubWFwKShzaW5nbGVJdGVtVmlldywgaXRlbXNJZHMpKVxuICAgICAgfSxcbiAgICAgIGdldDogREkudmlld3NTdG9yYWdlUGFja2FnZS5nZXRcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgREkudGhyb3dFcnJvcignZ2V0Vmlld3NDcXJzUGFja2FnZShDT05GSUcsIERJKScsIGVycm9yKVxuICB9XG59XG4iXX0=