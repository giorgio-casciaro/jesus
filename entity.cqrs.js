'use strict';

var R = require('ramda');
var checkRequired = require('./jesus').checkRequired;
var LOG = console;
var PACKAGE = 'entity.cqrs';

module.exports = function getEntityCqrsPackage(_ref) {
  var entityName = _ref.entityName,
      mutationsStorage = _ref.mutationsStorage,
      mutationsStorageCollection = _ref.mutationsStorageCollection,
      mutationsStorageConfig = _ref.mutationsStorageConfig,
      mutationsPath = _ref.mutationsPath,
      viewsStorage = _ref.viewsStorage,
      viewsStorageCollection = _ref.viewsStorageCollection,
      viewsStorageConfig = _ref.viewsStorageConfig,
      viewsSnapshotsStorage = _ref.viewsSnapshotsStorage,
      viewsSnapshotsStorageCollection = _ref.viewsSnapshotsStorageCollection,
      viewsSnapshotsStorageConfig = _ref.viewsSnapshotsStorageConfig,
      viewsSnapshotsMaxMutations = _ref.viewsSnapshotsMaxMutations;
  var mutationsStoragePackage, viewsStoragePackage, viewsSnapshotsStoragePackage, mutationsPackage, viewsPackage;
  return regeneratorRuntime.async(function getEntityCqrsPackage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          checkRequired({
            entityName: entityName,
            mutationsStorage: mutationsStorage, mutationsStorageCollection: mutationsStorageCollection, mutationsStorageConfig: mutationsStorageConfig, mutationsPath: mutationsPath,
            viewsStorage: viewsStorage, viewsStorageCollection: viewsStorageCollection, viewsStorageConfig: viewsStorageConfig,
            viewsSnapshotsStorage: viewsSnapshotsStorage, viewsSnapshotsStorageCollection: viewsSnapshotsStorageCollection, viewsSnapshotsStorageConfig: viewsSnapshotsStorageConfig
          }, PACKAGE);
          _context.next = 3;
          return regeneratorRuntime.awrap(mutationsStorage({ storageCollection: mutationsStorageCollection, storageConfig: mutationsStorageConfig }));

        case 3:
          mutationsStoragePackage = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(viewsStorage({ storageCollection: viewsStorageCollection, storageConfig: viewsStorageConfig }));

        case 6:
          viewsStoragePackage = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(viewsSnapshotsStorage({ storageCollection: viewsSnapshotsStorageCollection, storageConfig: viewsSnapshotsStorageConfig }));

        case 9:
          viewsSnapshotsStoragePackage = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(require('./mutations.cqrs')({ mutationsStoragePackage: mutationsStoragePackage, mutationsPath: mutationsPath }));

        case 12:
          mutationsPackage = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(require('./views.cqrs')({ viewsStoragePackage: viewsStoragePackage, viewsSnapshotsStoragePackage: viewsSnapshotsStoragePackage, mutationsPackage: mutationsPackage, viewsSnapshotsMaxMutations: viewsSnapshotsMaxMutations }));

        case 15:
          viewsPackage = _context.sent;
          return _context.abrupt('return', {
            mutationsPackage: mutationsPackage, viewsPackage: viewsPackage
          });

        case 17:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eS5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImNoZWNrUmVxdWlyZWQiLCJMT0ciLCJjb25zb2xlIiwiUEFDS0FHRSIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRFbnRpdHlDcXJzUGFja2FnZSIsImVudGl0eU5hbWUiLCJtdXRhdGlvbnNTdG9yYWdlIiwibXV0YXRpb25zU3RvcmFnZUNvbGxlY3Rpb24iLCJtdXRhdGlvbnNTdG9yYWdlQ29uZmlnIiwibXV0YXRpb25zUGF0aCIsInZpZXdzU3RvcmFnZSIsInZpZXdzU3RvcmFnZUNvbGxlY3Rpb24iLCJ2aWV3c1N0b3JhZ2VDb25maWciLCJ2aWV3c1NuYXBzaG90c1N0b3JhZ2UiLCJ2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb2xsZWN0aW9uIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlQ29uZmlnIiwidmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnMiLCJzdG9yYWdlQ29sbGVjdGlvbiIsInN0b3JhZ2VDb25maWciLCJtdXRhdGlvbnNTdG9yYWdlUGFja2FnZSIsInZpZXdzU3RvcmFnZVBhY2thZ2UiLCJ2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlIiwibXV0YXRpb25zUGFja2FnZSIsInZpZXdzUGFja2FnZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQU1DLGdCQUFnQkQsUUFBUSxTQUFSLEVBQW1CQyxhQUF6QztBQUNBLElBQUlDLE1BQU1DLE9BQVY7QUFDQSxJQUFNQyxVQUFVLGFBQWhCOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLG9CQUFmO0FBQUEsTUFDZkMsVUFEZSxRQUNmQSxVQURlO0FBQUEsTUFFZkMsZ0JBRmUsUUFFZkEsZ0JBRmU7QUFBQSxNQUVHQywwQkFGSCxRQUVHQSwwQkFGSDtBQUFBLE1BRStCQyxzQkFGL0IsUUFFK0JBLHNCQUYvQjtBQUFBLE1BRXVEQyxhQUZ2RCxRQUV1REEsYUFGdkQ7QUFBQSxNQUdmQyxZQUhlLFFBR2ZBLFlBSGU7QUFBQSxNQUdEQyxzQkFIQyxRQUdEQSxzQkFIQztBQUFBLE1BR3VCQyxrQkFIdkIsUUFHdUJBLGtCQUh2QjtBQUFBLE1BSWZDLHFCQUplLFFBSWZBLHFCQUplO0FBQUEsTUFJUUMsK0JBSlIsUUFJUUEsK0JBSlI7QUFBQSxNQUl5Q0MsMkJBSnpDLFFBSXlDQSwyQkFKekM7QUFBQSxNQUlzRUMsMEJBSnRFLFFBSXNFQSwwQkFKdEU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTWZsQix3QkFBYztBQUNaTyxrQ0FEWTtBQUVaQyw4Q0FGWSxFQUVNQyxzREFGTixFQUVrQ0MsOENBRmxDLEVBRTBEQyw0QkFGMUQ7QUFHWkMsc0NBSFksRUFHRUMsOENBSEYsRUFHMEJDLHNDQUgxQjtBQUlaQyx3REFKWSxFQUlXQyxnRUFKWCxFQUk0Q0M7QUFKNUMsV0FBZCxFQUtHZCxPQUxIO0FBTmU7QUFBQSwwQ0FZcUJLLGlCQUFpQixFQUFDVyxtQkFBbUJWLDBCQUFwQixFQUFnRFcsZUFBZVYsc0JBQS9ELEVBQWpCLENBWnJCOztBQUFBO0FBWVhXLGlDQVpXO0FBQUE7QUFBQSwwQ0FhaUJULGFBQWEsRUFBQ08sbUJBQW1CTixzQkFBcEIsRUFBNENPLGVBQWVOLGtCQUEzRCxFQUFiLENBYmpCOztBQUFBO0FBYVhRLDZCQWJXO0FBQUE7QUFBQSwwQ0FjMEJQLHNCQUFzQixFQUFDSSxtQkFBbUJILCtCQUFwQixFQUFxREksZUFBZUgsMkJBQXBFLEVBQXRCLENBZDFCOztBQUFBO0FBY1hNLHNDQWRXO0FBQUE7QUFBQSwwQ0FlY3hCLFFBQVEsa0JBQVIsRUFBNEIsRUFBQ3NCLGdEQUFELEVBQTBCViw0QkFBMUIsRUFBNUIsQ0FmZDs7QUFBQTtBQWVYYSwwQkFmVztBQUFBO0FBQUEsMENBZ0JVekIsUUFBUSxjQUFSLEVBQXdCLEVBQUN1Qix3Q0FBRCxFQUFzQkMsMERBQXRCLEVBQW9EQyxrQ0FBcEQsRUFBc0VOLHNEQUF0RSxFQUF4QixDQWhCVjs7QUFBQTtBQWdCWE8sc0JBaEJXO0FBQUEsMkNBa0JSO0FBQ0xELDhDQURLLEVBQ2FDO0FBRGIsV0FsQlE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoiZW50aXR5LmNxcnMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbnZhciBMT0cgPSBjb25zb2xlXG5jb25zdCBQQUNLQUdFID0gJ2VudGl0eS5jcXJzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldEVudGl0eUNxcnNQYWNrYWdlICh7XG4gIGVudGl0eU5hbWUsXG4gIG11dGF0aW9uc1N0b3JhZ2UsIG11dGF0aW9uc1N0b3JhZ2VDb2xsZWN0aW9uLCBtdXRhdGlvbnNTdG9yYWdlQ29uZmlnLCBtdXRhdGlvbnNQYXRoLFxuICB2aWV3c1N0b3JhZ2UsIHZpZXdzU3RvcmFnZUNvbGxlY3Rpb24sIHZpZXdzU3RvcmFnZUNvbmZpZyxcbiAgdmlld3NTbmFwc2hvdHNTdG9yYWdlLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb2xsZWN0aW9uLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb25maWcsIHZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zXG4gIH0pIHtcbiAgY2hlY2tSZXF1aXJlZCh7XG4gICAgZW50aXR5TmFtZSxcbiAgICBtdXRhdGlvbnNTdG9yYWdlLCBtdXRhdGlvbnNTdG9yYWdlQ29sbGVjdGlvbiwgbXV0YXRpb25zU3RvcmFnZUNvbmZpZywgbXV0YXRpb25zUGF0aCxcbiAgICB2aWV3c1N0b3JhZ2UsIHZpZXdzU3RvcmFnZUNvbGxlY3Rpb24sIHZpZXdzU3RvcmFnZUNvbmZpZyxcbiAgICB2aWV3c1NuYXBzaG90c1N0b3JhZ2UsIHZpZXdzU25hcHNob3RzU3RvcmFnZUNvbGxlY3Rpb24sIHZpZXdzU25hcHNob3RzU3RvcmFnZUNvbmZpZ1xuICB9LCBQQUNLQUdFKVxuICB2YXIgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2UgPSBhd2FpdCBtdXRhdGlvbnNTdG9yYWdlKHtzdG9yYWdlQ29sbGVjdGlvbjogbXV0YXRpb25zU3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWc6IG11dGF0aW9uc1N0b3JhZ2VDb25maWd9KVxuICB2YXIgdmlld3NTdG9yYWdlUGFja2FnZSA9IGF3YWl0IHZpZXdzU3RvcmFnZSh7c3RvcmFnZUNvbGxlY3Rpb246IHZpZXdzU3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWc6IHZpZXdzU3RvcmFnZUNvbmZpZ30pXG4gIHZhciB2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlID0gYXdhaXQgdmlld3NTbmFwc2hvdHNTdG9yYWdlKHtzdG9yYWdlQ29sbGVjdGlvbjogdmlld3NTbmFwc2hvdHNTdG9yYWdlQ29sbGVjdGlvbiwgc3RvcmFnZUNvbmZpZzogdmlld3NTbmFwc2hvdHNTdG9yYWdlQ29uZmlnfSlcbiAgdmFyIG11dGF0aW9uc1BhY2thZ2UgPSBhd2FpdCByZXF1aXJlKCcuL211dGF0aW9ucy5jcXJzJykoe211dGF0aW9uc1N0b3JhZ2VQYWNrYWdlLCBtdXRhdGlvbnNQYXRofSlcbiAgdmFyIHZpZXdzUGFja2FnZSA9IGF3YWl0IHJlcXVpcmUoJy4vdmlld3MuY3FycycpKHt2aWV3c1N0b3JhZ2VQYWNrYWdlLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlLCBtdXRhdGlvbnNQYWNrYWdlLCB2aWV3c1NuYXBzaG90c01heE11dGF0aW9uc30pXG5cbiAgcmV0dXJuIHtcbiAgICBtdXRhdGlvbnNQYWNrYWdlLCB2aWV3c1BhY2thZ2VcbiAgfVxufVxuIl19