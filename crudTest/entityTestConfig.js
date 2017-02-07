'use strict';

var R = require('ramda');
var path = require('path');
module.exports = function getEntityTestConfig(SERVICE, DI) {
  return regeneratorRuntime.async(function getEntityTestConfig$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt('return', {
            storageType: function storageType() {
              return SERVICE.config.mainStorage.type;
            },
            storageConfig: function storageConfig() {
              return SERVICE.config.mainStorage.config;
            },
            mutationsPath: function mutationsPath() {
              return path.join(__dirname, 'entityTest/mutations');
            },
            viewsSnapshotsMaxMutations: function viewsSnapshotsMaxMutations() {
              return 10;
            },
            validationSchema: function validationSchema() {
              try {
                return require('./entityTest/entity.schema.json');
              } catch (error) {
                DI.throwError('entityTestConfig validationSchema() ', error);
              }
            },
            validationType: function validationType() {
              return 'jsonSchema';
            }
          });

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eVRlc3RDb25maWcuZXM2Il0sIm5hbWVzIjpbIlIiLCJyZXF1aXJlIiwicGF0aCIsIm1vZHVsZSIsImV4cG9ydHMiLCJnZXRFbnRpdHlUZXN0Q29uZmlnIiwiU0VSVklDRSIsIkRJIiwic3RvcmFnZVR5cGUiLCJjb25maWciLCJtYWluU3RvcmFnZSIsInR5cGUiLCJzdG9yYWdlQ29uZmlnIiwibXV0YXRpb25zUGF0aCIsImpvaW4iLCJfX2Rpcm5hbWUiLCJ2aWV3c1NuYXBzaG90c01heE11dGF0aW9ucyIsInZhbGlkYXRpb25TY2hlbWEiLCJlcnJvciIsInRocm93RXJyb3IiLCJ2YWxpZGF0aW9uVHlwZSJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFJQSxJQUFJQyxRQUFRLE9BQVIsQ0FBUjtBQUNBLElBQUlDLE9BQU9ELFFBQVEsTUFBUixDQUFYO0FBQ0FFLE9BQU9DLE9BQVAsR0FBaUIsU0FBZUMsbUJBQWYsQ0FBb0NDLE9BQXBDLEVBQTRDQyxFQUE1QztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsMkNBRVI7QUFDTEMseUJBQWE7QUFBQSxxQkFBTUYsUUFBUUcsTUFBUixDQUFlQyxXQUFmLENBQTJCQyxJQUFqQztBQUFBLGFBRFI7QUFFTEMsMkJBQWU7QUFBQSxxQkFBTU4sUUFBUUcsTUFBUixDQUFlQyxXQUFmLENBQTJCRCxNQUFqQztBQUFBLGFBRlY7QUFHTEksMkJBQWU7QUFBQSxxQkFBTVgsS0FBS1ksSUFBTCxDQUFVQyxTQUFWLEVBQXFCLHNCQUFyQixDQUFOO0FBQUEsYUFIVjtBQUlMQyx3Q0FBNEI7QUFBQSxxQkFBTSxFQUFOO0FBQUEsYUFKdkI7QUFLTEMsOEJBQWtCLDRCQUFNO0FBQ3RCLGtCQUFJO0FBQ0YsdUJBQU9oQixRQUFRLGlDQUFSLENBQVA7QUFDRCxlQUZELENBRUUsT0FBT2lCLEtBQVAsRUFBYztBQUNkWCxtQkFBR1ksVUFBSCxDQUFjLHNDQUFkLEVBQXNERCxLQUF0RDtBQUNEO0FBQ0YsYUFYSTtBQVlMRSw0QkFBZ0I7QUFBQSxxQkFBTSxZQUFOO0FBQUE7QUFaWCxXQUZROztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLENBQWpCIiwiZmlsZSI6ImVudGl0eVRlc3RDb25maWcuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBnZXRFbnRpdHlUZXN0Q29uZmlnIChTRVJWSUNFLERJKSB7XG5cbiAgcmV0dXJuIHtcbiAgICBzdG9yYWdlVHlwZTogKCkgPT4gU0VSVklDRS5jb25maWcubWFpblN0b3JhZ2UudHlwZSxcbiAgICBzdG9yYWdlQ29uZmlnOiAoKSA9PiBTRVJWSUNFLmNvbmZpZy5tYWluU3RvcmFnZS5jb25maWcsXG4gICAgbXV0YXRpb25zUGF0aDogKCkgPT4gcGF0aC5qb2luKF9fZGlybmFtZSwgJ2VudGl0eVRlc3QvbXV0YXRpb25zJyksXG4gICAgdmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnM6ICgpID0+IDEwLFxuICAgIHZhbGlkYXRpb25TY2hlbWE6ICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiByZXF1aXJlKCcuL2VudGl0eVRlc3QvZW50aXR5LnNjaGVtYS5qc29uJylcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIERJLnRocm93RXJyb3IoJ2VudGl0eVRlc3RDb25maWcgdmFsaWRhdGlvblNjaGVtYSgpICcsIGVycm9yKVxuICAgICAgfVxuICAgIH0sXG4gICAgdmFsaWRhdGlvblR5cGU6ICgpID0+ICdqc29uU2NoZW1hJ1xuICB9XG59XG4iXX0=