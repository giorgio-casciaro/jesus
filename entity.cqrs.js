'use strict';

var R = require('ramda');
var checkRequired = require('./jesus').checkRequired;
var PACKAGE = 'entity.cqrs';

module.exports = function getEntityCqrsPackage(_ref, _ref2) {
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
  var serviceName = _ref2.serviceName,
      serviceId = _ref2.serviceId;
  var LOG, errorThrow, mutationsStoragePackage, viewsStoragePackage, viewsSnapshotsStoragePackage, mutationsPackage, viewsPackage;
  return regeneratorRuntime.async(function getEntityCqrsPackage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          LOG = require('./jesus').LOG(serviceName, serviceId, PACKAGE);
          errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
          _context.prev = 2;

          checkRequired({
            serviceName: serviceName, serviceId: serviceId,
            entityName: entityName,
            mutationsStorage: mutationsStorage, mutationsStorageCollection: mutationsStorageCollection, mutationsStorageConfig: mutationsStorageConfig, mutationsPath: mutationsPath,
            viewsStorage: viewsStorage, viewsStorageCollection: viewsStorageCollection, viewsStorageConfig: viewsStorageConfig,
            viewsSnapshotsStorage: viewsSnapshotsStorage, viewsSnapshotsStorageCollection: viewsSnapshotsStorageCollection, viewsSnapshotsStorageConfig: viewsSnapshotsStorageConfig
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(mutationsStorage({ serviceName: serviceName, serviceId: serviceId, storageCollection: mutationsStorageCollection, storageConfig: mutationsStorageConfig }));

        case 6:
          mutationsStoragePackage = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(viewsStorage({ serviceName: serviceName, serviceId: serviceId, storageCollection: viewsStorageCollection, storageConfig: viewsStorageConfig }));

        case 9:
          viewsStoragePackage = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(viewsSnapshotsStorage({ serviceName: serviceName, serviceId: serviceId, storageCollection: viewsSnapshotsStorageCollection, storageConfig: viewsSnapshotsStorageConfig }));

        case 12:
          viewsSnapshotsStoragePackage = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(require('./mutations.cqrs')({ serviceName: serviceName, serviceId: serviceId, mutationsStoragePackage: mutationsStoragePackage, mutationsPath: mutationsPath }));

        case 15:
          mutationsPackage = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(require('./views.cqrs')({ serviceName: serviceName, serviceId: serviceId, viewsStoragePackage: viewsStoragePackage, viewsSnapshotsStoragePackage: viewsSnapshotsStoragePackage, mutationsPackage: mutationsPackage, viewsSnapshotsMaxMutations: viewsSnapshotsMaxMutations }));

        case 18:
          viewsPackage = _context.sent;
          return _context.abrupt('return', {
            mutationsPackage: mutationsPackage, viewsPackage: viewsPackage
          });

        case 22:
          _context.prev = 22;
          _context.t0 = _context['catch'](2);

          errorThrow('getEntityCqrsPackage', { error: _context.t0, entityName: entityName });

        case 25:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this, [[2, 22]]);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eS5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImNoZWNrUmVxdWlyZWQiLCJQQUNLQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEVudGl0eUNxcnNQYWNrYWdlIiwiZW50aXR5TmFtZSIsIm11dGF0aW9uc1N0b3JhZ2UiLCJtdXRhdGlvbnNTdG9yYWdlQ29sbGVjdGlvbiIsIm11dGF0aW9uc1N0b3JhZ2VDb25maWciLCJtdXRhdGlvbnNQYXRoIiwidmlld3NTdG9yYWdlIiwidmlld3NTdG9yYWdlQ29sbGVjdGlvbiIsInZpZXdzU3RvcmFnZUNvbmZpZyIsInZpZXdzU25hcHNob3RzU3RvcmFnZSIsInZpZXdzU25hcHNob3RzU3RvcmFnZUNvbGxlY3Rpb24iLCJ2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb25maWciLCJ2aWV3c1NuYXBzaG90c01heE11dGF0aW9ucyIsInNlcnZpY2VOYW1lIiwic2VydmljZUlkIiwiTE9HIiwiZXJyb3JUaHJvdyIsInN0b3JhZ2VDb2xsZWN0aW9uIiwic3RvcmFnZUNvbmZpZyIsIm11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlIiwidmlld3NTdG9yYWdlUGFja2FnZSIsInZpZXdzU25hcHNob3RzU3RvcmFnZVBhY2thZ2UiLCJtdXRhdGlvbnNQYWNrYWdlIiwidmlld3NQYWNrYWdlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFNQyxnQkFBZ0JELFFBQVEsU0FBUixFQUFtQkMsYUFBekM7QUFDQSxJQUFNQyxVQUFVLGFBQWhCOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLG9CQUFmO0FBQUEsTUFDZkMsVUFEZSxRQUNmQSxVQURlO0FBQUEsTUFFZkMsZ0JBRmUsUUFFZkEsZ0JBRmU7QUFBQSxNQUVHQywwQkFGSCxRQUVHQSwwQkFGSDtBQUFBLE1BRStCQyxzQkFGL0IsUUFFK0JBLHNCQUYvQjtBQUFBLE1BRXVEQyxhQUZ2RCxRQUV1REEsYUFGdkQ7QUFBQSxNQUdmQyxZQUhlLFFBR2ZBLFlBSGU7QUFBQSxNQUdEQyxzQkFIQyxRQUdEQSxzQkFIQztBQUFBLE1BR3VCQyxrQkFIdkIsUUFHdUJBLGtCQUh2QjtBQUFBLE1BSWZDLHFCQUplLFFBSWZBLHFCQUplO0FBQUEsTUFJUUMsK0JBSlIsUUFJUUEsK0JBSlI7QUFBQSxNQUl5Q0MsMkJBSnpDLFFBSXlDQSwyQkFKekM7QUFBQSxNQUlzRUMsMEJBSnRFLFFBSXNFQSwwQkFKdEU7QUFBQSxNQUtiQyxXQUxhLFNBS2JBLFdBTGE7QUFBQSxNQUtBQyxTQUxBLFNBS0FBLFNBTEE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBTVhDLGFBTlcsR0FNTHBCLFFBQVEsU0FBUixFQUFtQm9CLEdBQW5CLENBQXVCRixXQUF2QixFQUFvQ0MsU0FBcEMsRUFBK0NqQixPQUEvQyxDQU5LO0FBT1htQixvQkFQVyxHQU9FckIsUUFBUSxTQUFSLEVBQW1CcUIsVUFBbkIsQ0FBOEJILFdBQTlCLEVBQTJDQyxTQUEzQyxFQUFzRGpCLE9BQXRELENBUEY7QUFBQTs7QUFTYkQsd0JBQWM7QUFDWmlCLG9DQURZLEVBQ0NDLG9CQUREO0FBRVpiLGtDQUZZO0FBR1pDLDhDQUhZLEVBR01DLHNEQUhOLEVBR2tDQyw4Q0FIbEMsRUFHMERDLDRCQUgxRDtBQUlaQyxzQ0FKWSxFQUlFQyw4Q0FKRixFQUkwQkMsc0NBSjFCO0FBS1pDLHdEQUxZLEVBS1dDLGdFQUxYLEVBSzRDQztBQUw1QyxXQUFkO0FBVGE7QUFBQSwwQ0FnQnVCVCxpQkFBaUIsRUFBQ1csd0JBQUQsRUFBY0Msb0JBQWQsRUFBeUJHLG1CQUFtQmQsMEJBQTVDLEVBQXdFZSxlQUFlZCxzQkFBdkYsRUFBakIsQ0FoQnZCOztBQUFBO0FBZ0JUZSxpQ0FoQlM7QUFBQTtBQUFBLDBDQWlCbUJiLGFBQWEsRUFBQ08sd0JBQUQsRUFBY0Msb0JBQWQsRUFBeUJHLG1CQUFtQlYsc0JBQTVDLEVBQW9FVyxlQUFlVixrQkFBbkYsRUFBYixDQWpCbkI7O0FBQUE7QUFpQlRZLDZCQWpCUztBQUFBO0FBQUEsMENBa0I0Qlgsc0JBQXNCLEVBQUNJLHdCQUFELEVBQWNDLG9CQUFkLEVBQXlCRyxtQkFBbUJQLCtCQUE1QyxFQUE2RVEsZUFBZVAsMkJBQTVGLEVBQXRCLENBbEI1Qjs7QUFBQTtBQWtCVFUsc0NBbEJTO0FBQUE7QUFBQSwwQ0FtQmdCMUIsUUFBUSxrQkFBUixFQUE0QixFQUFDa0Isd0JBQUQsRUFBY0Msb0JBQWQsRUFBeUJLLGdEQUF6QixFQUFrRGQsNEJBQWxELEVBQTVCLENBbkJoQjs7QUFBQTtBQW1CVGlCLDBCQW5CUztBQUFBO0FBQUEsMENBb0JZM0IsUUFBUSxjQUFSLEVBQXdCLEVBQUNrQix3QkFBRCxFQUFjQyxvQkFBZCxFQUF5Qk0sd0NBQXpCLEVBQThDQywwREFBOUMsRUFBNEVDLGtDQUE1RSxFQUE4RlYsc0RBQTlGLEVBQXhCLENBcEJaOztBQUFBO0FBb0JUVyxzQkFwQlM7QUFBQSwyQ0FzQk47QUFDTEQsOENBREssRUFDYUM7QUFEYixXQXRCTTs7QUFBQTtBQUFBO0FBQUE7O0FBMEJiUCxxQkFBVyxzQkFBWCxFQUFtQyxFQUFDUSxrQkFBRCxFQUFRdkIsc0JBQVIsRUFBbkM7O0FBMUJhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6ImVudGl0eS5jcXJzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBQQUNLQUdFID0gJ2VudGl0eS5jcXJzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldEVudGl0eUNxcnNQYWNrYWdlICh7XG4gIGVudGl0eU5hbWUsXG4gIG11dGF0aW9uc1N0b3JhZ2UsIG11dGF0aW9uc1N0b3JhZ2VDb2xsZWN0aW9uLCBtdXRhdGlvbnNTdG9yYWdlQ29uZmlnLCBtdXRhdGlvbnNQYXRoLFxuICB2aWV3c1N0b3JhZ2UsIHZpZXdzU3RvcmFnZUNvbGxlY3Rpb24sIHZpZXdzU3RvcmFnZUNvbmZpZyxcbiAgdmlld3NTbmFwc2hvdHNTdG9yYWdlLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb2xsZWN0aW9uLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb25maWcsIHZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zXG59LCB7c2VydmljZU5hbWUsIHNlcnZpY2VJZH0pIHtcbiAgdmFyIExPRyA9IHJlcXVpcmUoJy4vamVzdXMnKS5MT0coc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe1xuICAgICAgc2VydmljZU5hbWUsIHNlcnZpY2VJZCxcbiAgICAgIGVudGl0eU5hbWUsXG4gICAgICBtdXRhdGlvbnNTdG9yYWdlLCBtdXRhdGlvbnNTdG9yYWdlQ29sbGVjdGlvbiwgbXV0YXRpb25zU3RvcmFnZUNvbmZpZywgbXV0YXRpb25zUGF0aCxcbiAgICAgIHZpZXdzU3RvcmFnZSwgdmlld3NTdG9yYWdlQ29sbGVjdGlvbiwgdmlld3NTdG9yYWdlQ29uZmlnLFxuICAgICAgdmlld3NTbmFwc2hvdHNTdG9yYWdlLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb2xsZWN0aW9uLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb25maWdcbiAgICB9KVxuICAgIHZhciBtdXRhdGlvbnNTdG9yYWdlUGFja2FnZSA9IGF3YWl0IG11dGF0aW9uc1N0b3JhZ2Uoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uOiBtdXRhdGlvbnNTdG9yYWdlQ29sbGVjdGlvbiwgc3RvcmFnZUNvbmZpZzogbXV0YXRpb25zU3RvcmFnZUNvbmZpZ30pXG4gICAgdmFyIHZpZXdzU3RvcmFnZVBhY2thZ2UgPSBhd2FpdCB2aWV3c1N0b3JhZ2Uoe3NlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uOiB2aWV3c1N0b3JhZ2VDb2xsZWN0aW9uLCBzdG9yYWdlQ29uZmlnOiB2aWV3c1N0b3JhZ2VDb25maWd9KVxuICAgIHZhciB2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlID0gYXdhaXQgdmlld3NTbmFwc2hvdHNTdG9yYWdlKHtzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzdG9yYWdlQ29sbGVjdGlvbjogdmlld3NTbmFwc2hvdHNTdG9yYWdlQ29sbGVjdGlvbiwgc3RvcmFnZUNvbmZpZzogdmlld3NTbmFwc2hvdHNTdG9yYWdlQ29uZmlnfSlcbiAgICB2YXIgbXV0YXRpb25zUGFja2FnZSA9IGF3YWl0IHJlcXVpcmUoJy4vbXV0YXRpb25zLmNxcnMnKSh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2UsIG11dGF0aW9uc1BhdGh9KVxuICAgIHZhciB2aWV3c1BhY2thZ2UgPSBhd2FpdCByZXF1aXJlKCcuL3ZpZXdzLmNxcnMnKSh7c2VydmljZU5hbWUsIHNlcnZpY2VJZCwgdmlld3NTdG9yYWdlUGFja2FnZSwgdmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSwgbXV0YXRpb25zUGFja2FnZSwgdmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnN9KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG11dGF0aW9uc1BhY2thZ2UsIHZpZXdzUGFja2FnZVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJvclRocm93KCdnZXRFbnRpdHlDcXJzUGFja2FnZScsIHtlcnJvciwgZW50aXR5TmFtZX0pXG4gIH1cbn1cbiJdfQ==