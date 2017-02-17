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

                      LOG.debug(PACKAGE, 'updateView', { objId: objId, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations });
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
                      LOG.debug(PACKAGE, 'updatedView', { updatedView: updatedView, mutations: mutations });

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
                      throw new Error(PACKAGE + ' updateView');

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

                  LOG.debug(PACKAGE, 'refreshsViews', { objIds: objIds, loadSnapshot: loadSnapshot, addMutations: addMutations });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzLmNxcnMuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwiamVzdXMiLCJQQUNLQUdFIiwiY2hlY2tSZXF1aXJlZCIsIkxPRyIsImNvbnNvbGUiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0Vmlld3NDcXJzUGFja2FnZSIsInZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zIiwidmlld3NTdG9yYWdlUGFja2FnZSIsInZpZXdzU25hcHNob3RzU3RvcmFnZVBhY2thZ2UiLCJtdXRhdGlvbnNQYWNrYWdlIiwidXBkYXRlVmlldyIsIm9iaklkIiwibG9hZFNuYXBzaG90IiwibG9hZE11dGF0aW9ucyIsImFkZE11dGF0aW9ucyIsImRlYnVnIiwibGFzdFNuYXBzaG90IiwidGltZXN0YW1wIiwic3RhdGUiLCJtdXRhdGlvbnMiLCJmaW5kIiwicXVlcnkiLCJzb3J0IiwibGltaXQiLCJzdGFydCIsImxhc3RTbmFwc2hvdEZyb21EYiIsImdldE9iak11dGF0aW9ucyIsIm1pblRpbWVzdGFtcCIsImNvbmNhdCIsInVuaXFCeSIsInByb3AiLCJhcHBseU11dGF0aW9ucyIsInVwZGF0ZWRWaWV3IiwidXBkYXRlIiwicXVlcmllc0FycmF5IiwiZGF0YUFycmF5IiwiaW5zZXJ0SWZOb3RFeGlzdHMiLCJsZW5ndGgiLCJ2aWV3c1NuYXBzaG90c1N0b3JhZ2UiLCJpbnNlcnQiLCJEYXRlIiwibm93IiwiZXJyb3IiLCJFcnJvciIsInJlZnJlc2hWaWV3cyIsIm9iaklkcyIsInNpbmdsZVZpZXciLCJQcm9taXNlIiwiYWxsIiwibWFwIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQTtBQUNBO0FBQ0EsSUFBSUMsUUFBUUQsUUFBUSxTQUFSLENBQVo7QUFDQSxJQUFNRSxVQUFVLFlBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCSCxRQUFRLFNBQVIsRUFBbUJHLGFBQXpDO0FBQ0EsSUFBSUMsTUFBTUMsT0FBVjs7QUFF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ZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuLy8gdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbi8vIHZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbnZhciBqZXN1cyA9IHJlcXVpcmUoJy4vamVzdXMnKVxuY29uc3QgUEFDS0FHRSA9ICd2aWV3cy5jcXJzJ1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG52YXIgTE9HID0gY29uc29sZVxuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldFZpZXdzQ3Fyc1BhY2thZ2UgKHt2aWV3c1NuYXBzaG90c01heE11dGF0aW9ucywgdmlld3NTdG9yYWdlUGFja2FnZSwgdmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSwgbXV0YXRpb25zUGFja2FnZX0pIHtcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHt2aWV3c1NuYXBzaG90c01heE11dGF0aW9ucywgdmlld3NTdG9yYWdlUGFja2FnZSwgdmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSwgbXV0YXRpb25zUGFja2FnZX0sIFBBQ0tBR0UpXG4gICAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVmlldyAoe29iaklkLCBsb2FkU25hcHNob3QgPSB0cnVlLCBsb2FkTXV0YXRpb25zID0gdHJ1ZSwgYWRkTXV0YXRpb25zID0gW119KSB7XG4gICAgICB0cnkge1xuICAgICAgICBMT0cuZGVidWcoUEFDS0FHRSwgJ3VwZGF0ZVZpZXcnLCB7b2JqSWQsIGxvYWRTbmFwc2hvdCwgbG9hZE11dGF0aW9ucywgYWRkTXV0YXRpb25zIH0pXG4gICAgICAgIHZhciBsYXN0U25hcHNob3QgPSB7dGltZXN0YW1wOiAwLCBzdGF0ZToge319XG4gICAgICAgIHZhciBtdXRhdGlvbnMgPSBbXVxuICAgICAgICBpZiAobG9hZFNuYXBzaG90KSB7XG4gICAgICAgICAgdmFyIGxhc3RTbmFwc2hvdEZyb21EYiA9IGF3YWl0IHZpZXdzU25hcHNob3RzU3RvcmFnZVBhY2thZ2UuZmluZCh7cXVlcnk6IHtvYmpJZDogb2JqSWR9LCBzb3J0OiB7dGltZXN0YW1wOiAxfSwgbGltaXQ6IDEsIHN0YXJ0OiAwfSlcbiAgICAgICAgICBpZiAobGFzdFNuYXBzaG90RnJvbURiICYmIGxhc3RTbmFwc2hvdEZyb21EYlswXSkgbGFzdFNuYXBzaG90ID0gbGFzdFNuYXBzaG90RnJvbURiWzBdXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxvYWRNdXRhdGlvbnMpbXV0YXRpb25zID0gYXdhaXQgbXV0YXRpb25zUGFja2FnZS5nZXRPYmpNdXRhdGlvbnMoe29iaklkLCBtaW5UaW1lc3RhbXA6IGxhc3RTbmFwc2hvdC50aW1lc3RhbXB9KVxuXG4gICAgICAgIG11dGF0aW9ucyA9IG11dGF0aW9ucy5jb25jYXQoYWRkTXV0YXRpb25zKVxuICAgICAgICAvLyBjbGVhciBhcnJheSwgcmVtb3ZlIGR1cGxpY2F0ZSBpZHNcbiAgICAgICAgbXV0YXRpb25zID0gUi51bmlxQnkoUi5wcm9wKCdfaWQnKSwgbXV0YXRpb25zKVxuICAgICAgICB2YXIgdXBkYXRlZFZpZXcgPSBhd2FpdCBtdXRhdGlvbnNQYWNrYWdlLmFwcGx5TXV0YXRpb25zKHtzdGF0ZTogbGFzdFNuYXBzaG90LnN0YXRlLCBtdXRhdGlvbnN9KVxuICAgICAgICB2aWV3c1N0b3JhZ2VQYWNrYWdlLnVwZGF0ZSh7cXVlcmllc0FycmF5OiBbeydfaWQnOiBvYmpJZH1dLCBkYXRhQXJyYXk6IFt1cGRhdGVkVmlld10sIGluc2VydElmTm90RXhpc3RzOiB0cnVlfSlcbiAgICAgICAgTE9HLmRlYnVnKFBBQ0tBR0UsICd1cGRhdGVkVmlldycsIHt1cGRhdGVkVmlldywgbXV0YXRpb25zfSlcblxuICAgICAgICBpZiAodmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnMgPCBtdXRhdGlvbnMgJiYgbXV0YXRpb25zLmxlbmd0aCkge1xuICAgICAgICAgIGF3YWl0IHZpZXdzU25hcHNob3RzU3RvcmFnZS5pbnNlcnQoe3RpbWVzdGFtcDogRGF0ZS5ub3coKSwgc3RhdGU6IHVwZGF0ZWRWaWV3fSkgLy8gdXBkYXRlIHNuYXBzaG90IGlmIHJlcXVpcmVkXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIExPRy5lcnJvcihQQUNLQUdFLCBlcnJvciwge29iaklkLCBsb2FkU25hcHNob3QsIGxvYWRNdXRhdGlvbnMsIGFkZE11dGF0aW9uc30pXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihQQUNLQUdFICsgYCB1cGRhdGVWaWV3YClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlZnJlc2hWaWV3czogZnVuY3Rpb24gcmVmcmVzaFZpZXdzICh7b2JqSWRzLCBsb2FkU25hcHNob3QsIGxvYWRNdXRhdGlvbnMsIGFkZE11dGF0aW9ucyB9KSB7XG4gICAgICAgIExPRy5kZWJ1ZyhQQUNLQUdFLCAncmVmcmVzaHNWaWV3cycsIHtvYmpJZHMsIGxvYWRTbmFwc2hvdCwgYWRkTXV0YXRpb25zIH0pXG4gICAgICAgIGZ1bmN0aW9uIHNpbmdsZVZpZXcgKG9iaklkKSB7XG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZVZpZXcoe29iaklkLCBsb2FkU25hcHNob3QsIGxvYWRNdXRhdGlvbnMsIGFkZE11dGF0aW9uc30pXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKFIubWFwKHNpbmdsZVZpZXcsIG9iaklkcykpXG4gICAgICB9LFxuICAgICAgZ2V0OiB2aWV3c1N0b3JhZ2VQYWNrYWdlLmdldFxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBMT0cuZXJyb3IoUEFDS0FHRSwgZXJyb3IpXG4gICAgdGhyb3cgbmV3IEVycm9yKFBBQ0tBR0UgKyBgZ2V0Vmlld3NDcXJzUGFja2FnZSgpYClcbiAgfVxufVxuIl19