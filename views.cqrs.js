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
      _ref$serviceName = _ref.serviceName,
      serviceName = _ref$serviceName === undefined ? "unknow" : _ref$serviceName,
      _ref$serviceId = _ref.serviceId,
      serviceId = _ref$serviceId === undefined ? "unknow" : _ref$serviceId,
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
                CONSOLE.debug('loaded Mutations', { mutations: mutations });
                mutations = mutations.concat(addMutations);
                CONSOLE.debug('total Mutations', { mutations: mutations });
                mutations = R.uniqBy(R.prop('_id'), mutations);
                CONSOLE.debug('filtered Mutations', { mutations: mutations });
                _context.next = 14;
                return regeneratorRuntime.awrap(applyMutations({ state: lastSnapshot.state, mutations: mutations }));

              case 14:
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

              case 25:
                _context.prev = 25;
                _context.t0 = _context['catch'](0);

                CONSOLE.error(_context.t0);
                throw new Error(PACKAGE + ' updateView');

              case 29:
              case 'end':
                return _context.stop();
            }
          }
        }, null, this, [[0, 25]]);
      };

      checkRequired({ getConsole: getConsole, getObjMutations: getObjMutations, applyMutations: applyMutations });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzLmNxcnMuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwic2hvcnRoYXNoIiwidW5pcXVlIiwiUEFDS0FHRSIsImNoZWNrUmVxdWlyZWQiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0Vmlld3NDcXJzUGFja2FnZSIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsInNuYXBzaG90c01heE11dGF0aW9ucyIsImdldE9iak11dGF0aW9ucyIsImFwcGx5TXV0YXRpb25zIiwiQ09OU09MRSIsImVycm9yVGhyb3ciLCJ1cGRhdGVWaWV3Iiwib2JqSWQiLCJsYXN0U25hcHNob3QiLCJ0aW1lc3RhbXAiLCJzdGF0ZSIsImxvYWRNdXRhdGlvbnMiLCJhZGRNdXRhdGlvbnMiLCJkZWJ1ZyIsIm11dGF0aW9ucyIsIm1pblRpbWVzdGFtcCIsImNvbmNhdCIsInVuaXFCeSIsInByb3AiLCJ1cGRhdGVkVmlldyIsIl92aWV3QnVpbGRlZCIsIl92aWV3SGFzaCIsIkpTT04iLCJzdHJpbmdpZnkiLCJEYXRlIiwibm93IiwibmV3U25hcHNob3QiLCJsZW5ndGgiLCJlcnJvciIsIkVycm9yIiwicmVmcmVzaFZpZXdzIiwib2JqSWRzIiwic2luZ2xlVmlldyIsIlByb21pc2UiLCJhbGwiLCJtYXAiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLFlBQVlELFFBQVEsV0FBUixFQUFxQkUsTUFBckM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFNQyxVQUFVLFlBQWhCO0FBQ0EsSUFBTUMsZ0JBQWdCSixRQUFRLFNBQVIsRUFBbUJJLGFBQXpDOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQVNDLG1CQUFULE9BQW1KO0FBQUEsTUFBcEhDLFVBQW9ILFFBQXBIQSxVQUFvSDtBQUFBLDhCQUF4R0MsV0FBd0c7QUFBQSxNQUF4R0EsV0FBd0csb0NBQTVGLFFBQTRGO0FBQUEsNEJBQWxGQyxTQUFrRjtBQUFBLE1BQWxGQSxTQUFrRixrQ0FBeEUsUUFBd0U7QUFBQSxtQ0FBOURDLHFCQUE4RDtBQUFBLE1BQTlEQSxxQkFBOEQseUNBQXRDLEVBQXNDO0FBQUEsTUFBbENDLGVBQWtDLFFBQWxDQSxlQUFrQztBQUFBLE1BQWpCQyxjQUFpQixRQUFqQkEsY0FBaUI7O0FBQ2xLLE1BQUlDLFVBQVVOLFdBQVdDLFdBQVgsRUFBd0JDLFNBQXhCLEVBQW1DUCxPQUFuQyxDQUFkO0FBQ0EsTUFBSVksYUFBYWYsUUFBUSxTQUFSLEVBQW1CZSxVQUFuQixDQUE4Qk4sV0FBOUIsRUFBMkNDLFNBQTNDLEVBQXNEUCxPQUF0RCxDQUFqQjtBQUNBLE1BQUk7QUFBQTtBQUFBLFVBRWFhLFVBRmIsR0FFRjtBQUFBLFlBQTRCQyxLQUE1QixTQUE0QkEsS0FBNUI7QUFBQSx1Q0FBbUNDLFlBQW5DO0FBQUEsWUFBbUNBLFlBQW5DLHNDQUFrRCxFQUFDQyxXQUFXLENBQVosRUFBZUMsT0FBTyxFQUF0QixFQUFsRDtBQUFBLHdDQUE2RUMsYUFBN0U7QUFBQSxZQUE2RUEsYUFBN0UsdUNBQTZGLElBQTdGO0FBQUEsdUNBQW1HQyxZQUFuRztBQUFBLFlBQW1HQSxZQUFuRyxzQ0FBa0gsRUFBbEg7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBRUk7QUFDQVIsd0JBQVFTLEtBQVIsQ0FBYyxZQUFkLEVBQTRCLEVBQUNOLFlBQUQsRUFBUUMsMEJBQVIsRUFBc0JHLDRCQUF0QixFQUFxQ0MsMEJBQXJDLEVBQTVCO0FBQ0lFLHlCQUpSLEdBSW9CLEVBSnBCOztBQUFBLHFCQUtRSCxhQUxSO0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBQUEsZ0RBS3dDVCxnQkFBZ0IsRUFBQ0ssWUFBRCxFQUFRUSxjQUFjUCxhQUFhQyxTQUFuQyxFQUFoQixDQUx4Qzs7QUFBQTtBQUtzQksseUJBTHRCOztBQUFBO0FBTUlWLHdCQUFRUyxLQUFSLENBQWMsa0JBQWQsRUFBa0MsRUFBQ0Msb0JBQUQsRUFBbEM7QUFDQUEsNEJBQVlBLFVBQVVFLE1BQVYsQ0FBaUJKLFlBQWpCLENBQVo7QUFDQVIsd0JBQVFTLEtBQVIsQ0FBYyxpQkFBZCxFQUFpQyxFQUFDQyxvQkFBRCxFQUFqQztBQUNBQSw0QkFBWXpCLEVBQUU0QixNQUFGLENBQVM1QixFQUFFNkIsSUFBRixDQUFPLEtBQVAsQ0FBVCxFQUF3QkosU0FBeEIsQ0FBWjtBQUNBVix3QkFBUVMsS0FBUixDQUFjLG9CQUFkLEVBQW9DLEVBQUNDLG9CQUFELEVBQXBDO0FBVko7QUFBQSxnREFXNEJYLGVBQWUsRUFBQ08sT0FBT0YsYUFBYUUsS0FBckIsRUFBNEJJLG9CQUE1QixFQUFmLENBWDVCOztBQUFBO0FBV1FLLDJCQVhSOzs7QUFhSTtBQUNBLG9CQUFJQSxZQUFZQyxZQUFoQixFQUE4QixPQUFPRCxZQUFZQyxZQUFuQjtBQUM5QixvQkFBSUQsWUFBWUUsU0FBaEIsRUFBMkIsT0FBT0YsWUFBWUUsU0FBbkI7QUFDM0JGLDRCQUFZRSxTQUFaLEdBQXdCOUIsVUFBVStCLEtBQUtDLFNBQUwsQ0FBZUosV0FBZixDQUFWLENBQXhCO0FBQ0FBLDRCQUFZQyxZQUFaLEdBQTJCSSxLQUFLQyxHQUFMLEVBQTNCOztBQUVBO0FBQ0lDLDJCQXBCUixHQW9Cc0IsS0FwQnRCOztBQXFCSSxvQkFBSXpCLHdCQUF3QmEsU0FBeEIsSUFBcUNBLFVBQVVhLE1BQW5ELEVBQTJERCxjQUFjLEVBQUNqQixXQUFXZSxLQUFLQyxHQUFMLEVBQVosRUFBd0JmLE9BQU9TLFdBQS9CLEVBQWQsQ0FyQi9ELENBcUJ5SDs7QUFFckhmLHdCQUFRUyxLQUFSLENBQWMsYUFBZCxFQUE2QixFQUFDTSx3QkFBRCxFQUFjTCxvQkFBZCxFQUE3QjtBQXZCSixpREF3QlcsRUFBQ0ssd0JBQUQsRUFBY08sd0JBQWQsRUF4Qlg7O0FBQUE7QUFBQTtBQUFBOztBQTBCSXRCLHdCQUFRd0IsS0FBUjtBQTFCSixzQkEyQlUsSUFBSUMsS0FBSixDQUFVcEMsdUJBQVYsQ0EzQlY7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsT0FGRTs7QUFDRkMsb0JBQWMsRUFBRUksc0JBQUYsRUFBY0ksZ0NBQWQsRUFBK0JDLDhCQUEvQixFQUFkOztBQStCQTtBQUFBLFdBQU87QUFDTDJCLHdCQUFjLFNBQVNBLFlBQVQsUUFBK0Q7QUFBQSxnQkFBdkNDLE1BQXVDLFNBQXZDQSxNQUF1QztBQUFBLGdCQUEvQnBCLGFBQStCLFNBQS9CQSxhQUErQjtBQUFBLGdCQUFoQkMsWUFBZ0IsU0FBaEJBLFlBQWdCOztBQUMzRVIsb0JBQVFTLEtBQVIsQ0FBYyxlQUFkLEVBQStCLEVBQUNrQixjQUFELEVBQVNuQiwwQkFBVCxFQUEvQjtBQUNBLHFCQUFTb0IsVUFBVCxDQUFxQnpCLEtBQXJCLEVBQTRCO0FBQzFCLHFCQUFPRCxXQUFXLEVBQUNDLFlBQUQsRUFBUUksNEJBQVIsRUFBdUJDLDBCQUF2QixFQUFYLENBQVA7QUFDRDtBQUNELG1CQUFPcUIsUUFBUUMsR0FBUixDQUFZN0MsRUFBRThDLEdBQUYsQ0FBTUgsVUFBTixFQUFrQkQsTUFBbEIsQ0FBWixDQUFQO0FBQ0Q7QUFQSTtBQUFQO0FBaENFOztBQUFBO0FBeUNILEdBekNELENBeUNFLE9BQU9ILEtBQVAsRUFBYztBQUNkdkIsd0NBQW9DLEVBQUN1QixZQUFELEVBQXBDO0FBQ0Q7QUFDRixDQS9DRCIsImZpbGUiOiJ2aWV3cy5jcXJzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHNob3J0aGFzaCA9IHJlcXVpcmUoJ3Nob3J0aGFzaCcpLnVuaXF1ZVxuLy8gdmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbi8vIHZhciBmcyA9IHJlcXVpcmUoJ2ZzJylcbi8vIHZhciBqZXN1cyA9IHJlcXVpcmUoJy4vamVzdXMnKVxuY29uc3QgUEFDS0FHRSA9ICd2aWV3cy5jcXJzJ1xuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0Vmlld3NDcXJzUGFja2FnZSAoe2dldENvbnNvbGUsIHNlcnZpY2VOYW1lPVwidW5rbm93XCIsIHNlcnZpY2VJZD1cInVua25vd1wiLCBzbmFwc2hvdHNNYXhNdXRhdGlvbnMgPSAxMCwgZ2V0T2JqTXV0YXRpb25zLCBhcHBseU11dGF0aW9uc30pIHtcbiAgdmFyIENPTlNPTEUgPSBnZXRDb25zb2xlKHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIFBBQ0tBR0UpXG4gIHZhciBlcnJvclRocm93ID0gcmVxdWlyZSgnLi9qZXN1cycpLmVycm9yVGhyb3coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdHJ5IHtcbiAgICBjaGVja1JlcXVpcmVkKHsgZ2V0Q29uc29sZSwgZ2V0T2JqTXV0YXRpb25zLCBhcHBseU11dGF0aW9uc30pXG4gICAgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVmlldyAoe29iaklkLCBsYXN0U25hcHNob3QgPSB7dGltZXN0YW1wOiAwLCBzdGF0ZToge319LCBsb2FkTXV0YXRpb25zID0gdHJ1ZSwgYWRkTXV0YXRpb25zID0gW119KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBDT0xMRUNUIE1VVEFUSU9OUyBBTkQgVVBEQVRFIFZJRVdcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygndXBkYXRlVmlldycsIHtvYmpJZCwgbGFzdFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnMgfSlcbiAgICAgICAgdmFyIG11dGF0aW9ucyA9IFtdXG4gICAgICAgIGlmIChsb2FkTXV0YXRpb25zKW11dGF0aW9ucyA9IGF3YWl0IGdldE9iak11dGF0aW9ucyh7b2JqSWQsIG1pblRpbWVzdGFtcDogbGFzdFNuYXBzaG90LnRpbWVzdGFtcH0pXG4gICAgICAgIENPTlNPTEUuZGVidWcoJ2xvYWRlZCBNdXRhdGlvbnMnLCB7bXV0YXRpb25zIH0pXG4gICAgICAgIG11dGF0aW9ucyA9IG11dGF0aW9ucy5jb25jYXQoYWRkTXV0YXRpb25zKVxuICAgICAgICBDT05TT0xFLmRlYnVnKCd0b3RhbCBNdXRhdGlvbnMnLCB7bXV0YXRpb25zIH0pXG4gICAgICAgIG11dGF0aW9ucyA9IFIudW5pcUJ5KFIucHJvcCgnX2lkJyksIG11dGF0aW9ucylcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygnZmlsdGVyZWQgTXV0YXRpb25zJywge211dGF0aW9ucyB9KVxuICAgICAgICB2YXIgdXBkYXRlZFZpZXcgPSBhd2FpdCBhcHBseU11dGF0aW9ucyh7c3RhdGU6IGxhc3RTbmFwc2hvdC5zdGF0ZSwgbXV0YXRpb25zfSlcblxuICAgICAgICAvLyBWSUVXIE1FVEEgREFUQSBfdmlld1xuICAgICAgICBpZiAodXBkYXRlZFZpZXcuX3ZpZXdCdWlsZGVkKSBkZWxldGUgdXBkYXRlZFZpZXcuX3ZpZXdCdWlsZGVkXG4gICAgICAgIGlmICh1cGRhdGVkVmlldy5fdmlld0hhc2gpIGRlbGV0ZSB1cGRhdGVkVmlldy5fdmlld0hhc2hcbiAgICAgICAgdXBkYXRlZFZpZXcuX3ZpZXdIYXNoID0gc2hvcnRoYXNoKEpTT04uc3RyaW5naWZ5KHVwZGF0ZWRWaWV3KSlcbiAgICAgICAgdXBkYXRlZFZpZXcuX3ZpZXdCdWlsZGVkID0gRGF0ZS5ub3coKVxuXG4gICAgICAgIC8vIE5FVyBTTkFQU0hPVFxuICAgICAgICB2YXIgbmV3U25hcHNob3QgPSBmYWxzZVxuICAgICAgICBpZiAoc25hcHNob3RzTWF4TXV0YXRpb25zIDwgbXV0YXRpb25zICYmIG11dGF0aW9ucy5sZW5ndGgpIG5ld1NuYXBzaG90ID0ge3RpbWVzdGFtcDogRGF0ZS5ub3coKSwgc3RhdGU6IHVwZGF0ZWRWaWV3fSAvLyB1cGRhdGUgc25hcHNob3QgaWYgcmVxdWlyZWRcblxuICAgICAgICBDT05TT0xFLmRlYnVnKCd1cGRhdGVkVmlldycsIHt1cGRhdGVkVmlldywgbXV0YXRpb25zfSlcbiAgICAgICAgcmV0dXJuIHt1cGRhdGVkVmlldywgbmV3U25hcHNob3R9XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBDT05TT0xFLmVycm9yKGVycm9yKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoUEFDS0FHRSArIGAgdXBkYXRlVmlld2ApXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICByZWZyZXNoVmlld3M6IGZ1bmN0aW9uIHJlZnJlc2hWaWV3cyAoe29iaklkcywgbG9hZE11dGF0aW9ucywgYWRkTXV0YXRpb25zIH0pIHtcbiAgICAgICAgQ09OU09MRS5kZWJ1ZygncmVmcmVzaHNWaWV3cycsIHtvYmpJZHMsIGFkZE11dGF0aW9ucyB9KVxuICAgICAgICBmdW5jdGlvbiBzaW5nbGVWaWV3IChvYmpJZCkge1xuICAgICAgICAgIHJldHVybiB1cGRhdGVWaWV3KHtvYmpJZCwgbG9hZE11dGF0aW9ucywgYWRkTXV0YXRpb25zfSlcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoUi5tYXAoc2luZ2xlVmlldywgb2JqSWRzKSlcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgZXJyb3JUaHJvdyhgZ2V0Vmlld3NDcXJzUGFja2FnZSgpYCwge2Vycm9yfSlcbiAgfVxufVxuIl19