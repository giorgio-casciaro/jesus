'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var R = require('ramda');
var shorthash = require('shorthash').unique;
// var path = require('path')
// var fs = require('fs')
// var jesus = require('./jesus')
var PACKAGE = 'views.cqrs';
var checkRequired = require('./jesus').checkRequired;

module.exports = function getViewsCqrsPackage(_ref) {
  var getConsole = _ref.getConsole,
      serviceName = _ref.serviceName,
      serviceId = _ref.serviceId,
      _ref$snapshotsMaxMuta = _ref.snapshotsMaxMutations,
      snapshotsMaxMutations = _ref$snapshotsMaxMuta === undefined ? 10 : _ref$snapshotsMaxMuta,
      getObjMutations = _ref.getObjMutations,
      applyMutations = _ref.applyMutations;

  var CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
  var errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
  try {
    var _ret = function () {
      var updateView = function _callee(_ref2) {
        var objId = _ref2.objId,
            _ref2$lastSnapshot = _ref2.lastSnapshot,
            lastSnapshot = _ref2$lastSnapshot === undefined ? { timestamp: 0, state: {} } : _ref2$lastSnapshot,
            _ref2$loadMutations = _ref2.loadMutations,
            loadMutations = _ref2$loadMutations === undefined ? true : _ref2$loadMutations,
            _ref2$addMutations = _ref2.addMutations,
            addMutations = _ref2$addMutations === undefined ? [] : _ref2$addMutations;
        var mutations, updatedView, newSnapshot;
        return regeneratorRuntime.async(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;

                // COLLECT MUTATIONS AND UPDATE VIEW
                CONSOLE.debug('updateView', { objId: objId, lastSnapshot: lastSnapshot, loadMutations: loadMutations, addMutations: addMutations });
                mutations = [];

                if (!loadMutations) {
                  _context.next = 7;
                  break;
                }

                _context.next = 6;
                return regeneratorRuntime.awrap(getObjMutations({ objId: objId, minTimestamp: lastSnapshot.timestamp }));

              case 6:
                mutations = _context.sent;

              case 7:
                mutations = mutations.concat(addMutations);
                mutations = R.uniqBy(R.prop('_id'), mutations);
                _context.next = 11;
                return regeneratorRuntime.awrap(applyMutations({ state: lastSnapshot.state, mutations: mutations }));

              case 11:
                updatedView = _context.sent;


                // VIEW META DATA _view
                if (updatedView._viewBuilded) delete updatedView._viewBuilded;
                if (updatedView._viewHash) delete updatedView._viewHash;
                updatedView._viewHash = shorthash(JSON.stringify(updatedView));
                updatedView._viewBuilded = Date.now();

                // NEW SNAPSHOT
                newSnapshot = false;

                if (snapshotsMaxMutations < mutations && mutations.length) newSnapshot = { timestamp: Date.now(), state: updatedView }; // update snapshot if required

                CONSOLE.debug('updatedView', { updatedView: updatedView, mutations: mutations });
                return _context.abrupt('return', { updatedView: updatedView, newSnapshot: newSnapshot });

              case 22:
                _context.prev = 22;
                _context.t0 = _context['catch'](0);

                CONSOLE.error(_context.t0);
                throw new Error(PACKAGE + ' updateView');

              case 26:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this, [[0, 22]]);
      };

      checkRequired({ serviceName: serviceName, serviceId: serviceId, getConsole: getConsole, getObjMutations: getObjMutations, applyMutations: applyMutations });

      return {
        v: {
          refreshViews: function refreshViews(_ref3) {
            var objIds = _ref3.objIds,
                loadMutations = _ref3.loadMutations,
                addMutations = _ref3.addMutations;

            CONSOLE.debug('refreshsViews', { objIds: objIds, addMutations: addMutations });
            function singleView(objId) {
              return updateView({ objId: objId, loadMutations: loadMutations, addMutations: addMutations });
            }
            return Promise.all(R.map(singleView, objIds));
          }
        }
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  } catch (error) {
    errorThrow('getViewsCqrsPackage()', { error: error });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzLmNxcnMuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2hvcnRoYXNoIiwidW5pcXVlIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0Vmlld3NDcXJzUGFja2FnZSIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsInNuYXBzaG90c01heE11dGF0aW9ucyIsImdldE9iak11dGF0aW9ucyIsImFwcGx5TXV0YXRpb25zIiwiQ09OU09MRSIsImVycm9yVGhyb3ciLCJ1cGRhdGVWaWV3Iiwib2JqSWQiLCJsYXN0U25hcHNob3QiLCJ0aW1lc3RhbXAiLCJzdGF0ZSIsImxvYWRNdXRhdGlvbnMiLCJhZGRNdXRhdGlvbnMiLCJkZWJ1ZyIsIm11dGF0aW9ucyIsIm1pblRpbWVzdGFtcCIsImNvbmNhdCIsInVuaXFCeSIsInByb3AiLCJ1cGRhdGVkVmlldyIsIl92aWV3QnVpbGRlZCIsIl92aWV3SGFzaCIsIkpTT04iLCJzdHJpbmdpZnkiLCJEYXRlIiwibm93IiwibmV3U25hcHNob3QiLCJsZW5ndGgiLCJlcnJvciIsIkVycm9yIiwicmVmcmVzaFZpZXdzIiwib2JqSWRzIiwic2luZ2xlVmlldyIsIlByb21pc2UiLCJhbGwiLCJtYXAiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLFlBQVlELFFBQVEsV0FBUixFQUFxQkUsTUFBckM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNQyxVQUFVLFlBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCSixRQUFRLFNBQVIsRUFBbUJJLGFBQXpDOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQVNDLG1CQUFULE9BQWlJO0FBQUEsTUFBbEdDLFVBQWtHLFFBQWxHQSxVQUFrRztBQUFBLE1BQXRGQyxXQUFzRixRQUF0RkEsV0FBc0Y7QUFBQSxNQUF6RUMsU0FBeUUsUUFBekVBLFNBQXlFO0FBQUEs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QUEsZ0JBQWhCQyxZQUFnQixTQUFoQkEsWUFBZ0I7O0FBQzNFUixvQkFBUVMsS0FBUixDQUFjLGVBQWQsRUFBK0IsRUFBQ2tCLGNBQUQsRUFBU25CLDBCQUFULEVBQS9CO0FBQ0EscUJBQVNvQixVQUFULENBQXFCekIsS0FBckIsRUFBNEI7QUFDMUIscUJBQU9ELFdBQVcsRUFBQ0MsWUFBRCxFQUFRSSw0QkFBUixFQUF1QkMsMEJBQXZCLEVBQVgsQ0FBUDtBQUNEO0FBQ0QsbUJBQU9xQixRQUFRQyxHQUFSLENBQVk3QyxFQUFFOEMsR0FBRixDQUFNSCxVQUFOLEVBQWtCRCxNQUFsQixDQUFaLENBQVA7QUFDRDtBQVBJO0FBQVA7QUE3QkU7O0FBQUE7QUFzQ0gsR0F0Q0QsQ0FzQ0UsT0FBT0gsS0FBUCxFQUFjO0FBQ2R2Qix3Q0FBb0MsRUFBQ3VCLFlBQUQsRUFBcEM7QUFDRDtBQUNGLENBNUNEIiwiZmlsZSI6InZpZXdzLmNxcnMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgc2hvcnRoYXNoID0gcmVxdWlyZSgnc2hvcnRoYXNoJykudW5pcXVlXG4vLyB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuLy8gdmFyIGZzID0gcmVxdWlyZSgnZnMnKVxuLy8gdmFyIGplc3VzID0gcmVxdWlyZSgnLi9qZXN1cycpXG5jb25zdCBQQUNLQUdFID0gJ3ZpZXdzLmNxcnMnXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRWaWV3c0NxcnNQYWNrYWdlICh7Z2V0Q29uc29sZSwgc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgc25hcHNob3RzTWF4TXV0YXRpb25zID0gMTAsIGdldE9iak11dGF0aW9ucywgYXBwbHlNdXRhdGlvbnN9KSB7XG4gIHZhciBDT05TT0xFID0gZ2V0Q29uc29sZShzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB2YXIgZXJyb3JUaHJvdyA9IHJlcXVpcmUoJy4vamVzdXMnKS5lcnJvclRocm93KHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHRyeSB7XG4gICAgY2hlY2tSZXF1aXJlZCh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgZ2V0Q29uc29sZSwgZ2V0T2JqTXV0YXRpb25zLCBhcHBseU11dGF0aW9uc30pXG4gICAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVmlldyAoe29iaklkLCBsYXN0U25hcHNob3QgPSB7dGltZXN0YW1wOiAwLCBzdGF0ZToge319LCBsb2FkTXV0YXRpb25zID0gdHJ1ZSwgYWRkTXV0YXRpb25zID0gW119KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBDT0xMRUNUIE1VVEFUSU9OUyBBTkQgVVBEQVRFIFZJRVdcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygndXBkYXRlVmlldycsIHtvYmpJZCwgbGFzdFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnMgfSlcbiAgICAgICAgdmFyIG11dGF0aW9ucyA9IFtdXG4gICAgICAgIGlmIChsb2FkTXV0YXRpb25zKW11dGF0aW9ucyA9IGF3YWl0IGdldE9iak11dGF0aW9ucyh7b2JqSWQsIG1pblRpbWVzdGFtcDogbGFzdFNuYXBzaG90LnRpbWVzdGFtcH0pXG4gICAgICAgIG11dGF0aW9ucyA9IG11dGF0aW9ucy5jb25jYXQoYWRkTXV0YXRpb25zKVxuICAgICAgICBtdXRhdGlvbnMgPSBSLnVuaXFCeShSLnByb3AoJ19pZCcpLCBtdXRhdGlvbnMpXG4gICAgICAgIHZhciB1cGRhdGVkVmlldyA9IGF3YWl0IGFwcGx5TXV0YXRpb25zKHtzdGF0ZTogbGFzdFNuYXBzaG90LnN0YXRlLCBtdXRhdGlvbnN9KVxuXG4gICAgICAgIC8vIFZJRVcgTUVUQSBEQVRBIF92aWV3XG4gICAgICAgIGlmICh1cGRhdGVkVmlldy5fdmlld0J1aWxkZWQpIGRlbGV0ZSB1cGRhdGVkVmlldy5fdmlld0J1aWxkZWRcbiAgICAgICAgaWYgKHVwZGF0ZWRWaWV3Ll92aWV3SGFzaCkgZGVsZXRlIHVwZGF0ZWRWaWV3Ll92aWV3SGFzaFxuICAgICAgICB1cGRhdGVkVmlldy5fdmlld0hhc2ggPSBzaG9ydGhhc2goSlNPTi5zdHJpbmdpZnkodXBkYXRlZFZpZXcpKVxuICAgICAgICB1cGRhdGVkVmlldy5fdmlld0J1aWxkZWQgPSBEYXRlLm5vdygpXG5cbiAgICAgICAgLy8gTkVXIFNOQVBTSE9UXG4gICAgICAgIHZhciBuZXdTbmFwc2hvdCA9IGZhbHNlXG4gICAgICAgIGlmIChzbmFwc2hvdHNNYXhNdXRhdGlvbnMgPCBtdXRhdGlvbnMgJiYgbXV0YXRpb25zLmxlbmd0aCkgbmV3U25hcHNob3QgPSB7dGltZXN0YW1wOiBEYXRlLm5vdygpLCBzdGF0ZTogdXBkYXRlZFZpZXd9IC8vIHVwZGF0ZSBzbmFwc2hvdCBpZiByZXF1aXJlZFxuXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ3VwZGF0ZWRWaWV3Jywge3VwZGF0ZWRWaWV3LCBtdXRhdGlvbnN9KVxuICAgICAgICByZXR1cm4ge3VwZGF0ZWRWaWV3LCBuZXdTbmFwc2hvdH1cbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIENPTlNPTEUuZXJyb3IoZXJyb3IpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihQQUNLQUdFICsgYCB1cGRhdGVWaWV3YClcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlZnJlc2hWaWV3czogZnVuY3Rpb24gcmVmcmVzaFZpZXdzICh7b2JqSWRzLCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnMgfSkge1xuICAgICAgICBDT05TT0xFLmRlYnVnKCdyZWZyZXNoc1ZpZXdzJywge29iaklkcywgYWRkTXV0YXRpb25zIH0pXG4gICAgICAgIGZ1bmN0aW9uIHNpbmdsZVZpZXcgKG9iaklkKSB7XG4gICAgICAgICAgcmV0dXJuIHVwZGF0ZVZpZXcoe29iaklkLCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnN9KVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChSLm1hcChzaW5nbGVWaWV3LCBvYmpJZHMpKVxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJvclRocm93KGBnZXRWaWV3c0NxcnNQYWNrYWdlKClgLCB7ZXJyb3J9KVxuICB9XG59XG4iXX0=