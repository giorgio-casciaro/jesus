'use strict';

var R = require('ramda');
var path = require('path');
var storagePackage = require('../storage');
module.exports = function getEntityTestDI(DI, entityTestConfig) {
  var entityTestDI;
  return regeneratorRuntime.async(function getEntityTestDI$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          entityTestDI = R.clone(DI);

          entityTestDI.mutationsStoragePackage = storagePackage(R.merge(entityTestConfig, {
            storageCollection: function storageCollection() {
              return 'entityTestMutations';
            }
          }), DI);
          entityTestDI.viewsStoragePackage = storagePackage(R.merge(entityTestConfig, {
            storageCollection: function storageCollection() {
              return 'entityTestViewsMain';
            }
          }), DI);
          entityTestDI.viewsSnapshotsStoragePackage = storagePackage(R.merge(entityTestConfig, {
            storageCollection: function storageCollection() {
              return 'entityTestViewsMainSnapshots';
            }
          }), DI);
          _context.next = 6;
          return regeneratorRuntime.awrap(require('../mutations.cqrs')(entityTestConfig, entityTestDI));

        case 6:
          entityTestDI.mutationsPackage = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(require('../views.cqrs')(entityTestConfig, entityTestDI));

        case 9:
          entityTestDI.viewsPackage = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(require('../validate')(entityTestConfig, entityTestDI));

        case 12:
          entityTestDI.validate = _context.sent;
          return _context.abrupt('return', entityTestDI);

        case 14:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eVRlc3RESS5lczYiXSwibmFtZXMiOlsiUiIsInJlcXVpcmUiLCJwYXRoIiwic3RvcmFnZVBhY2thZ2UiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0RW50aXR5VGVzdERJIiwiREkiLCJlbnRpdHlUZXN0Q29uZmlnIiwiZW50aXR5VGVzdERJIiwiY2xvbmUiLCJtdXRhdGlvbnNTdG9yYWdlUGFja2FnZSIsIm1lcmdlIiwic3RvcmFnZUNvbGxlY3Rpb24iLCJ2aWV3c1N0b3JhZ2VQYWNrYWdlIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSIsIm11dGF0aW9uc1BhY2thZ2UiLCJ2aWV3c1BhY2thZ2UiLCJ2YWxpZGF0ZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUUsaUJBQWlCRixRQUFRLFlBQVIsQ0FBckI7QUFDQUcsT0FBT0MsT0FBUCxHQUFpQixTQUFlQyxlQUFmLENBQWdDQyxFQUFoQyxFQUFtQ0MsZ0JBQW5DO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNYQyxzQkFEVyxHQUNJVCxFQUFFVSxLQUFGLENBQVFILEVBQVIsQ0FESjs7QUFFZkUsdUJBQWFFLHVCQUFiLEdBQXVDUixlQUFlSCxFQUFFWSxLQUFGLENBQVFKLGdCQUFSLEVBQTBCO0FBQzlFSywrQkFBbUI7QUFBQSxxQkFBTSxxQkFBTjtBQUFBO0FBRDJELFdBQTFCLENBQWYsRUFFbkNOLEVBRm1DLENBQXZDO0FBR0FFLHVCQUFhSyxtQkFBYixHQUFtQ1gsZUFBZUgsRUFBRVksS0FBRixDQUFRSixnQkFBUixFQUEwQjtBQUMxRUssK0JBQW1CO0FBQUEscUJBQU0scUJBQU47QUFBQTtBQUR1RCxXQUExQixDQUFmLEVBRS9CTixFQUYrQixDQUFuQztBQUdBRSx1QkFBYU0sNEJBQWIsR0FBNENaLGVBQWVILEVBQUVZLEtBQUYsQ0FBUUosZ0JBQVIsRUFBMEI7QUFDbkZLLCtCQUFtQjtBQUFBLHFCQUFNLDhCQUFOO0FBQUE7QUFEZ0UsV0FBMUIsQ0FBZixFQUV4Q04sRUFGd0MsQ0FBNUM7QUFSZTtBQUFBLDBDQVd1Qk4sUUFBUSxtQkFBUixFQUE2Qk8sZ0JBQTdCLEVBQStDQyxZQUEvQyxDQVh2Qjs7QUFBQTtBQVdmQSx1QkFBYU8sZ0JBWEU7QUFBQTtBQUFBLDBDQVltQmYsUUFBUSxlQUFSLEVBQXlCTyxnQkFBekIsRUFBMkNDLFlBQTNDLENBWm5COztBQUFBO0FBWWZBLHVCQUFhUSxZQVpFO0FBQUE7QUFBQSwwQ0FhZWhCLFFBQVEsYUFBUixFQUF1Qk8sZ0JBQXZCLEVBQXlDQyxZQUF6QyxDQWJmOztBQUFBO0FBYWZBLHVCQUFhUyxRQWJFO0FBQUEsMkNBY1JULFlBZFE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoiZW50aXR5VGVzdERJLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxudmFyIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbnZhciBzdG9yYWdlUGFja2FnZSA9IHJlcXVpcmUoJy4uL3N0b3JhZ2UnKVxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBnZXRFbnRpdHlUZXN0REkgKERJLGVudGl0eVRlc3RDb25maWcpIHtcbiAgdmFyIGVudGl0eVRlc3RESSA9IFIuY2xvbmUoREkpXG4gIGVudGl0eVRlc3RESS5tdXRhdGlvbnNTdG9yYWdlUGFja2FnZSA9IHN0b3JhZ2VQYWNrYWdlKFIubWVyZ2UoZW50aXR5VGVzdENvbmZpZywge1xuICAgIHN0b3JhZ2VDb2xsZWN0aW9uOiAoKSA9PiAnZW50aXR5VGVzdE11dGF0aW9ucydcbiAgfSksIERJKVxuICBlbnRpdHlUZXN0REkudmlld3NTdG9yYWdlUGFja2FnZSA9IHN0b3JhZ2VQYWNrYWdlKFIubWVyZ2UoZW50aXR5VGVzdENvbmZpZywge1xuICAgIHN0b3JhZ2VDb2xsZWN0aW9uOiAoKSA9PiAnZW50aXR5VGVzdFZpZXdzTWFpbidcbiAgfSksIERJKVxuICBlbnRpdHlUZXN0REkudmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSA9IHN0b3JhZ2VQYWNrYWdlKFIubWVyZ2UoZW50aXR5VGVzdENvbmZpZywge1xuICAgIHN0b3JhZ2VDb2xsZWN0aW9uOiAoKSA9PiAnZW50aXR5VGVzdFZpZXdzTWFpblNuYXBzaG90cydcbiAgfSksIERJKVxuICBlbnRpdHlUZXN0REkubXV0YXRpb25zUGFja2FnZSA9IGF3YWl0IHJlcXVpcmUoJy4uL211dGF0aW9ucy5jcXJzJykoZW50aXR5VGVzdENvbmZpZywgZW50aXR5VGVzdERJKVxuICBlbnRpdHlUZXN0REkudmlld3NQYWNrYWdlID0gYXdhaXQgcmVxdWlyZSgnLi4vdmlld3MuY3FycycpKGVudGl0eVRlc3RDb25maWcsIGVudGl0eVRlc3RESSlcbiAgZW50aXR5VGVzdERJLnZhbGlkYXRlID0gYXdhaXQgcmVxdWlyZSgnLi4vdmFsaWRhdGUnKShlbnRpdHlUZXN0Q29uZmlnLCBlbnRpdHlUZXN0REkpXG4gIHJldHVybiBlbnRpdHlUZXN0RElcbn1cbiJdfQ==