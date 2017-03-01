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
  var getConsole = _ref2.getConsole,
      serviceName = _ref2.serviceName,
      serviceId = _ref2.serviceId;
  var CONSOLE, errorThrow, mutationsStoragePackage, viewsStoragePackage, viewsSnapshotsStoragePackage, mutationsPackage, viewsPackage;
  return regeneratorRuntime.async(function getEntityCqrsPackage$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          CONSOLE = getConsole(serviceName, serviceId, PACKAGE);
          errorThrow = require('./jesus').errorThrow(serviceName, serviceId, PACKAGE);
          _context.prev = 2;

          checkRequired({
            serviceName: serviceName, serviceId: serviceId,
            entityName: entityName, getConsole: getConsole,
            mutationsStorage: mutationsStorage, mutationsStorageCollection: mutationsStorageCollection, mutationsStorageConfig: mutationsStorageConfig, mutationsPath: mutationsPath,
            viewsStorage: viewsStorage, viewsStorageCollection: viewsStorageCollection, viewsStorageConfig: viewsStorageConfig,
            viewsSnapshotsStorage: viewsSnapshotsStorage, viewsSnapshotsStorageCollection: viewsSnapshotsStorageCollection, viewsSnapshotsStorageConfig: viewsSnapshotsStorageConfig
          });
          _context.next = 6;
          return regeneratorRuntime.awrap(mutationsStorage({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, storageCollection: mutationsStorageCollection, storageConfig: mutationsStorageConfig }));

        case 6:
          mutationsStoragePackage = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(viewsStorage({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, storageCollection: viewsStorageCollection, storageConfig: viewsStorageConfig }));

        case 9:
          viewsStoragePackage = _context.sent;
          _context.next = 12;
          return regeneratorRuntime.awrap(viewsSnapshotsStorage({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, storageCollection: viewsSnapshotsStorageCollection, storageConfig: viewsSnapshotsStorageConfig }));

        case 12:
          viewsSnapshotsStoragePackage = _context.sent;
          _context.next = 15;
          return regeneratorRuntime.awrap(require('./mutations.cqrs')({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, mutationsStoragePackage: mutationsStoragePackage, mutationsPath: mutationsPath }));

        case 15:
          mutationsPackage = _context.sent;
          _context.next = 18;
          return regeneratorRuntime.awrap(require('./views.cqrs')({ getConsole: getConsole, serviceName: serviceName, serviceId: serviceId, viewsStoragePackage: viewsStoragePackage, viewsSnapshotsStoragePackage: viewsSnapshotsStoragePackage, mutationsPackage: mutationsPackage, viewsSnapshotsMaxMutations: viewsSnapshotsMaxMutations }));

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eS5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImNoZWNrUmVxdWlyZWQiLCJQQUNLQUdFIiwibW9kdWxlIiwiZXhwb3J0cyIsImdldEVudGl0eUNxcnNQYWNrYWdlIiwiZW50aXR5TmFtZSIsIm11dGF0aW9uc1N0b3JhZ2UiLCJtdXRhdGlvbnNTdG9yYWdlQ29sbGVjdGlvbiIsIm11dGF0aW9uc1N0b3JhZ2VDb25maWciLCJtdXRhdGlvbnNQYXRoIiwidmlld3NTdG9yYWdlIiwidmlld3NTdG9yYWdlQ29sbGVjdGlvbiIsInZpZXdzU3RvcmFnZUNvbmZpZyIsInZpZXdzU25hcHNob3RzU3RvcmFnZSIsInZpZXdzU25hcHNob3RzU3RvcmFnZUNvbGxlY3Rpb24iLCJ2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb25maWciLCJ2aWV3c1NuYXBzaG90c01heE11dGF0aW9ucyIsImdldENvbnNvbGUiLCJzZXJ2aWNlTmFtZSIsInNlcnZpY2VJZCIsIkNPTlNPTEUiLCJlcnJvclRocm93Iiwic3RvcmFnZUNvbGxlY3Rpb24iLCJzdG9yYWdlQ29uZmlnIiwibXV0YXRpb25zU3RvcmFnZVBhY2thZ2UiLCJ2aWV3c1N0b3JhZ2VQYWNrYWdlIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSIsIm11dGF0aW9uc1BhY2thZ2UiLCJ2aWV3c1BhY2thZ2UiLCJlcnJvciJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQU1DLGdCQUFnQkQsUUFBUSxTQUFSLEVBQW1CQyxhQUF6QztBQUNBLElBQU1DLFVBQVUsYUFBaEI7O0FBRUFDLE9BQU9DLE9BQVAsR0FBaUIsU0FBZUMsb0JBQWY7QUFBQSxNQUNmQyxVQURlLFFBQ2ZBLFVBRGU7QUFBQSxNQUVmQyxnQkFGZSxRQUVmQSxnQkFGZTtBQUFBLE1BRUdDLDBCQUZILFFBRUdBLDBCQUZIO0FBQUEsTUFFK0JDLHNCQUYvQixRQUUrQkEsc0JBRi9CO0FBQUEsTUFFdURDLGFBRnZELFFBRXVEQSxhQUZ2RDtBQUFBLE1BR2ZDLFlBSGUsUUFHZkEsWUFIZTtBQUFBLE1BR0RDLHNCQUhDLFFBR0RBLHNCQUhDO0FBQUEsTUFHdUJDLGtCQUh2QixRQUd1QkEsa0JBSHZCO0FBQUEsTUFJZkMscUJBSmUsUUFJZkEscUJBSmU7QUFBQSxNQUlRQywrQkFKUixRQUlRQSwrQkFKUjtBQUFBLE1BSXlDQywyQkFKekMsUUFJeUNBLDJCQUp6QztBQUFBLE1BSXNFQywwQkFKdEUsUUFJc0VBLDBCQUp0RTtBQUFBLE1BS2JDLFVBTGEsU0FLYkEsVUFMYTtBQUFBLE1BS0ZDLFdBTEUsU0FLRkEsV0FMRTtBQUFBLE1BS1dDLFNBTFgsU0FLV0EsU0FMWDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFNWEMsaUJBTlcsR0FNREgsV0FBV0MsV0FBWCxFQUF3QkMsU0FBeEIsRUFBbUNsQixPQUFuQyxDQU5DO0FBT1hvQixvQkFQVyxHQU9FdEIsUUFBUSxTQUFSLEVBQW1Cc0IsVUFBbkIsQ0FBOEJILFdBQTlCLEVBQTJDQyxTQUEzQyxFQUFzRGxCLE9BQXRELENBUEY7QUFBQTs7QUFTYkQsd0JBQWM7QUFDWmtCLG9DQURZLEVBQ0NDLG9CQUREO0FBRVpkLGtDQUZZLEVBRURZLHNCQUZDO0FBR1pYLDhDQUhZLEVBR01DLHNEQUhOLEVBR2tDQyw4Q0FIbEMsRUFHMERDLDRCQUgxRDtBQUlaQyxzQ0FKWSxFQUlFQyw4Q0FKRixFQUkwQkMsc0NBSjFCO0FBS1pDLHdEQUxZLEVBS1dDLGdFQUxYLEVBSzRDQztBQUw1QyxXQUFkO0FBVGE7QUFBQSwwQ0FnQnVCVCxpQkFBaUIsRUFBQ1csc0JBQUQsRUFBWUMsd0JBQVosRUFBeUJDLG9CQUF6QixFQUFvQ0csbUJBQW1CZiwwQkFBdkQsRUFBbUZnQixlQUFlZixzQkFBbEcsRUFBakIsQ0FoQnZCOztBQUFBO0FBZ0JUZ0IsaUNBaEJTO0FBQUE7QUFBQSwwQ0FpQm1CZCxhQUFhLEVBQUNPLHNCQUFELEVBQVlDLHdCQUFaLEVBQXlCQyxvQkFBekIsRUFBb0NHLG1CQUFtQlgsc0JBQXZELEVBQStFWSxlQUFlWCxrQkFBOUYsRUFBYixDQWpCbkI7O0FBQUE7QUFpQlRhLDZCQWpCUztBQUFBO0FBQUEsMENBa0I0Qlosc0JBQXNCLEVBQUNJLHNCQUFELEVBQVlDLHdCQUFaLEVBQXlCQyxvQkFBekIsRUFBb0NHLG1CQUFtQlIsK0JBQXZELEVBQXdGUyxlQUFlUiwyQkFBdkcsRUFBdEIsQ0FsQjVCOztBQUFBO0FBa0JUVyxzQ0FsQlM7QUFBQTtBQUFBLDBDQW1CZ0IzQixRQUFRLGtCQUFSLEVBQTRCLEVBQUNrQixzQkFBRCxFQUFZQyx3QkFBWixFQUF5QkMsb0JBQXpCLEVBQW9DSyxnREFBcEMsRUFBNkRmLDRCQUE3RCxFQUE1QixDQW5CaEI7O0FBQUE7QUFtQlRrQiwwQkFuQlM7QUFBQTtBQUFBLDBDQW9CWTVCLFFBQVEsY0FBUixFQUF3QixFQUFDa0Isc0JBQUQsRUFBWUMsd0JBQVosRUFBeUJDLG9CQUF6QixFQUFvQ00sd0NBQXBDLEVBQXlEQywwREFBekQsRUFBdUZDLGtDQUF2RixFQUF5R1gsc0RBQXpHLEVBQXhCLENBcEJaOztBQUFBO0FBb0JUWSxzQkFwQlM7QUFBQSwyQ0FzQk47QUFDTEQsOENBREssRUFDYUM7QUFEYixXQXRCTTs7QUFBQTtBQUFBO0FBQUE7O0FBMEJiUCxxQkFBVyxzQkFBWCxFQUFtQyxFQUFDUSxrQkFBRCxFQUFReEIsc0JBQVIsRUFBbkM7O0FBMUJhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6ImVudGl0eS5jcXJzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbInZhciBSID0gcmVxdWlyZSgncmFtZGEnKVxuY29uc3QgY2hlY2tSZXF1aXJlZCA9IHJlcXVpcmUoJy4vamVzdXMnKS5jaGVja1JlcXVpcmVkXG5jb25zdCBQQUNLQUdFID0gJ2VudGl0eS5jcXJzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFzeW5jIGZ1bmN0aW9uIGdldEVudGl0eUNxcnNQYWNrYWdlICh7XG4gIGVudGl0eU5hbWUsXG4gIG11dGF0aW9uc1N0b3JhZ2UsIG11dGF0aW9uc1N0b3JhZ2VDb2xsZWN0aW9uLCBtdXRhdGlvbnNTdG9yYWdlQ29uZmlnLCBtdXRhdGlvbnNQYXRoLFxuICB2aWV3c1N0b3JhZ2UsIHZpZXdzU3RvcmFnZUNvbGxlY3Rpb24sIHZpZXdzU3RvcmFnZUNvbmZpZyxcbiAgdmlld3NTbmFwc2hvdHNTdG9yYWdlLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb2xsZWN0aW9uLCB2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb25maWcsIHZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zXG59LCB7Z2V0Q29uc29sZSxzZXJ2aWNlTmFtZSwgc2VydmljZUlkfSkge1xuICB2YXIgQ09OU09MRSA9IGdldENvbnNvbGUoc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgUEFDS0FHRSlcbiAgdmFyIGVycm9yVGhyb3cgPSByZXF1aXJlKCcuL2plc3VzJykuZXJyb3JUaHJvdyhzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBQQUNLQUdFKVxuICB0cnkge1xuICAgIGNoZWNrUmVxdWlyZWQoe1xuICAgICAgc2VydmljZU5hbWUsIHNlcnZpY2VJZCxcbiAgICAgIGVudGl0eU5hbWUsZ2V0Q29uc29sZSxcbiAgICAgIG11dGF0aW9uc1N0b3JhZ2UsIG11dGF0aW9uc1N0b3JhZ2VDb2xsZWN0aW9uLCBtdXRhdGlvbnNTdG9yYWdlQ29uZmlnLCBtdXRhdGlvbnNQYXRoLFxuICAgICAgdmlld3NTdG9yYWdlLCB2aWV3c1N0b3JhZ2VDb2xsZWN0aW9uLCB2aWV3c1N0b3JhZ2VDb25maWcsXG4gICAgICB2aWV3c1NuYXBzaG90c1N0b3JhZ2UsIHZpZXdzU25hcHNob3RzU3RvcmFnZUNvbGxlY3Rpb24sIHZpZXdzU25hcHNob3RzU3RvcmFnZUNvbmZpZ1xuICAgIH0pXG4gICAgdmFyIG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlID0gYXdhaXQgbXV0YXRpb25zU3RvcmFnZSh7Z2V0Q29uc29sZSxzZXJ2aWNlTmFtZSwgc2VydmljZUlkLCBzdG9yYWdlQ29sbGVjdGlvbjogbXV0YXRpb25zU3RvcmFnZUNvbGxlY3Rpb24sIHN0b3JhZ2VDb25maWc6IG11dGF0aW9uc1N0b3JhZ2VDb25maWd9KVxuICAgIHZhciB2aWV3c1N0b3JhZ2VQYWNrYWdlID0gYXdhaXQgdmlld3NTdG9yYWdlKHtnZXRDb25zb2xlLHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uOiB2aWV3c1N0b3JhZ2VDb2xsZWN0aW9uLCBzdG9yYWdlQ29uZmlnOiB2aWV3c1N0b3JhZ2VDb25maWd9KVxuICAgIHZhciB2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlID0gYXdhaXQgdmlld3NTbmFwc2hvdHNTdG9yYWdlKHtnZXRDb25zb2xlLHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIHN0b3JhZ2VDb2xsZWN0aW9uOiB2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb2xsZWN0aW9uLCBzdG9yYWdlQ29uZmlnOiB2aWV3c1NuYXBzaG90c1N0b3JhZ2VDb25maWd9KVxuICAgIHZhciBtdXRhdGlvbnNQYWNrYWdlID0gYXdhaXQgcmVxdWlyZSgnLi9tdXRhdGlvbnMuY3FycycpKHtnZXRDb25zb2xlLHNlcnZpY2VOYW1lLCBzZXJ2aWNlSWQsIG11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlLCBtdXRhdGlvbnNQYXRofSlcbiAgICB2YXIgdmlld3NQYWNrYWdlID0gYXdhaXQgcmVxdWlyZSgnLi92aWV3cy5jcXJzJykoe2dldENvbnNvbGUsc2VydmljZU5hbWUsIHNlcnZpY2VJZCwgdmlld3NTdG9yYWdlUGFja2FnZSwgdmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSwgbXV0YXRpb25zUGFja2FnZSwgdmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnN9KVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIG11dGF0aW9uc1BhY2thZ2UsIHZpZXdzUGFja2FnZVxuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBlcnJvclRocm93KCdnZXRFbnRpdHlDcXJzUGFja2FnZScsIHtlcnJvciwgZW50aXR5TmFtZX0pXG4gIH1cbn1cbiJdfQ==