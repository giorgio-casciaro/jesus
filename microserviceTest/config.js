'use strict';

var R = require('ramda');
var path = require('path');
var uuidV4 = require('uuid/v4');

var mainStorage = require('../storage.inmemory');
var mainStorageType = 'inmemory';
var mainStorageConfig = {
  path: path.join(__dirname, 'fileDb')
};
module.exports = {
  name: 'testMicroservice',
  instanceId: uuidV4(),
  tags: 'public permissions',
  proto: path.join(__dirname, '/shared/services/testMicroservice.proto'),
  grpcCredentials: function grpcCredentials() {
    return require('grpc').credentials.createInsecure();
  },
  grpcUrl: '0.0.0.0:10000',
  restPort: 8080,
  NODE_ENV: 'development',
  logPath: 'microserviceTest/logs',
  debugActive: true,
  eventsRegistry: function eventsRegistry() {
    return false;
  },
  'autorizationsView': {
    filterData: R.pick(['_id', 'name']), //function per filtrare i fields degli item, tiene solo quelli interessanti per la view
    storage: mainStorage,
    storageConfig: mainStorageConfig,
    storageCollection: function storageCollection() {
      return 'autorizationsView';
    }
  },
  'UserPermission': {
    entityName: 'UserPermission',
    proto: path.join(__dirname, '/shared/entities/Permission/entity.proto'),
    validationsPath: path.join(__dirname, '/shared/entities/Permission/'),
    storage: mainStorage,
    storageConfig: mainStorageConfig,
    storageCollection: function storageCollection() {
      return 'UserPermissions';
    }
    // permissionsExtra: () => [
    //   {entity: '*', action: '*', type: 'roleBased', permit: true, force: true, priority: 0, roleBasedArgs: {roleId: 'admin'}},
    //   {entity: '*', action: '*', type: 'userBased', permit: true, force: true, priority: 10, userBasedArgs: {userId: 'admin'}},
    //   {entity: '*', action: '*', type: 'contextBased', permit: true, force: true, priority: 100, contextBasedArgs: {ip: '127.0.0.1'}}
    // ]
  },
  'User': {
    entityName: 'User',
    proto: './shared/entities/User/entity.proto',
    // mutations: {
    //   create: {
    //     validationSchema: () => require('./shared/entities/User/create.schema.json'),
    //     validate: require("../validate.jsonSchema"),
    //   },
    //   update: {
    //     validationSchema: () => require('./shared/entities/User/update.schema.json'),
    //     validate: require("../validate.jsonSchema"),
    //   }
    // },
    mutationsStorage: {
      storage: mainStorage,
      storageConfig: mainStorageConfig,
      storageCollection: function storageCollection() {
        return 'UserMutations';
      }
    },
    mutationsPath: function mutationsPath() {
      return path.join(__dirname, './shared/entities/User/mutations');
    },
    viewsStorage: {
      storage: mainStorage,
      storageConfig: mainStorageConfig,
      storageCollection: function storageCollection() {
        return 'UserViewsStorage';
      }
    },
    viewsSnapshotsStorage: {
      storage: mainStorage,
      storageConfig: mainStorageConfig,
      storageCollection: function storageCollection() {
        return 'UserViewsSnapshots';
      }
    },
    viewsSnapshotsMaxMutations: function viewsSnapshotsMaxMutations() {
      return 10;
    }
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy5lczYiXSwibmFtZXMiOlsiUiIsInJlcXVpcmUiLCJwYXRoIiwidXVpZFY0IiwibWFpblN0b3JhZ2UiLCJtYWluU3RvcmFnZVR5cGUiLCJtYWluU3RvcmFnZUNvbmZpZyIsImpvaW4iLCJfX2Rpcm5hbWUiLCJtb2R1bGUiLCJleHBvcnRzIiwibmFtZSIsImluc3RhbmNlSWQiLCJ0YWdzIiwicHJvdG8iLCJncnBjQ3JlZGVudGlhbHMiLCJjcmVkZW50aWFscyIsImNyZWF0ZUluc2VjdXJlIiwiZ3JwY1VybCIsInJlc3RQb3J0IiwiTk9ERV9FTlYiLCJsb2dQYXRoIiwiZGVidWdBY3RpdmUiLCJldmVudHNSZWdpc3RyeSIsImZpbHRlckRhdGEiLCJwaWNrIiwic3RvcmFnZSIsInN0b3JhZ2VDb25maWciLCJzdG9yYWdlQ29sbGVjdGlvbiIsImVudGl0eU5hbWUiLCJ2YWxpZGF0aW9uc1BhdGgiLCJtdXRhdGlvbnNTdG9yYWdlIiwibXV0YXRpb25zUGF0aCIsInZpZXdzU3RvcmFnZSIsInZpZXdzU25hcHNob3RzU3RvcmFnZSIsInZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLElBQUlDLFFBQVEsT0FBUixDQUFSO0FBQ0EsSUFBSUMsT0FBT0QsUUFBUSxNQUFSLENBQVg7QUFDQSxJQUFNRSxTQUFTRixRQUFRLFNBQVIsQ0FBZjs7QUFFQSxJQUFJRyxjQUFjSCxRQUFRLHFCQUFSLENBQWxCO0FBQ0EsSUFBSUksa0JBQWtCLFVBQXRCO0FBQ0EsSUFBSUMsb0JBQW9CO0FBQ3RCSixRQUFNQSxLQUFLSyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsUUFBckI7QUFEZ0IsQ0FBeEI7QUFHQUMsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNLGtCQURTO0FBRWZDLGNBQVlULFFBRkc7QUFHZlUsUUFBTSxvQkFIUztBQUlmQyxTQUFPWixLQUFLSyxJQUFMLENBQVVDLFNBQVYsRUFBcUIseUNBQXJCLENBSlE7QUFLZk8sbUJBQWdCO0FBQUEsV0FBSWQsUUFBUSxNQUFSLEVBQWdCZSxXQUFoQixDQUE0QkMsY0FBNUIsRUFBSjtBQUFBLEdBTEQ7QUFNZkMsV0FBUyxlQU5NO0FBT2ZDLFlBQVUsSUFQSztBQVFmQyxZQUFVLGFBUks7QUFTZkMsV0FBUyx1QkFUTTtBQVVmQyxlQUFhLElBVkU7QUFXZkMsa0JBQWdCO0FBQUEsV0FBTSxLQUFOO0FBQUEsR0FYRDtBQVlmLHVCQUFxQjtBQUNuQkMsZ0JBQVd4QixFQUFFeUIsSUFBRixDQUFPLENBQUMsS0FBRCxFQUFRLE1BQVIsQ0FBUCxDQURRLEVBQ2lCO0FBQ3BDQyxhQUFTdEIsV0FGVTtBQUduQnVCLG1CQUFlckIsaUJBSEk7QUFJbkJzQix1QkFBbUI7QUFBQSxhQUFNLG1CQUFOO0FBQUE7QUFKQSxHQVpOO0FBa0JmLG9CQUFrQjtBQUNoQkMsZ0JBQVksZ0JBREk7QUFFaEJmLFdBQU9aLEtBQUtLLElBQUwsQ0FBVUMsU0FBVixFQUFxQiwwQ0FBckIsQ0FGUztBQUdoQnNCLHFCQUFpQjVCLEtBQUtLLElBQUwsQ0FBVUMsU0FBVixFQUFxQiw4QkFBckIsQ0FIRDtBQUloQmtCLGFBQVN0QixXQUpPO0FBS2hCdUIsbUJBQWVyQixpQkFMQztBQU1oQnNCLHVCQUFtQjtBQUFBLGFBQU0saUJBQU47QUFBQTtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBWGdCLEdBbEJIO0FBK0JmLFVBQVE7QUFDTkMsZ0JBQVksTUFETjtBQUVOZixXQUFPLHFDQUZEO0FBR047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQWlCLHNCQUFrQjtBQUNoQkwsZUFBU3RCLFdBRE87QUFFaEJ1QixxQkFBZXJCLGlCQUZDO0FBR2hCc0IseUJBQW1CO0FBQUEsZUFBTSxlQUFOO0FBQUE7QUFISCxLQWJaO0FBa0JOSSxtQkFBZTtBQUFBLGFBQU05QixLQUFLSyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsa0NBQXJCLENBQU47QUFBQSxLQWxCVDtBQW1CTnlCLGtCQUFjO0FBQ1pQLGVBQVN0QixXQURHO0FBRVp1QixxQkFBZXJCLGlCQUZIO0FBR1pzQix5QkFBbUI7QUFBQSxlQUFNLGtCQUFOO0FBQUE7QUFIUCxLQW5CUjtBQXdCTk0sMkJBQXVCO0FBQ3JCUixlQUFTdEIsV0FEWTtBQUVyQnVCLHFCQUFlckIsaUJBRk07QUFHckJzQix5QkFBbUI7QUFBQSxlQUFNLG9CQUFOO0FBQUE7QUFIRSxLQXhCakI7QUE2Qk5PLGdDQUE0QjtBQUFBLGFBQU0sRUFBTjtBQUFBO0FBN0J0QjtBQS9CTyxDQUFqQiIsImZpbGUiOiJjb25maWcuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG5cbnZhciBtYWluU3RvcmFnZSA9IHJlcXVpcmUoJy4uL3N0b3JhZ2UuaW5tZW1vcnknKVxudmFyIG1haW5TdG9yYWdlVHlwZSA9ICdpbm1lbW9yeSdcbnZhciBtYWluU3RvcmFnZUNvbmZpZyA9IHtcbiAgcGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJ2ZpbGVEYicpXG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgbmFtZTogJ3Rlc3RNaWNyb3NlcnZpY2UnLFxuICBpbnN0YW5jZUlkOiB1dWlkVjQoKSxcbiAgdGFnczogJ3B1YmxpYyBwZXJtaXNzaW9ucycsXG4gIHByb3RvOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnL3NoYXJlZC9zZXJ2aWNlcy90ZXN0TWljcm9zZXJ2aWNlLnByb3RvJyksXG4gIGdycGNDcmVkZW50aWFsczooKT0+cmVxdWlyZSgnZ3JwYycpLmNyZWRlbnRpYWxzLmNyZWF0ZUluc2VjdXJlKCksXG4gIGdycGNVcmw6ICcwLjAuMC4wOjEwMDAwJyxcbiAgcmVzdFBvcnQ6IDgwODAsXG4gIE5PREVfRU5WOiAnZGV2ZWxvcG1lbnQnLFxuICBsb2dQYXRoOiAnbWljcm9zZXJ2aWNlVGVzdC9sb2dzJyxcbiAgZGVidWdBY3RpdmU6IHRydWUsXG4gIGV2ZW50c1JlZ2lzdHJ5OiAoKSA9PiBmYWxzZSxcbiAgJ2F1dG9yaXphdGlvbnNWaWV3Jzoge1xuICAgIGZpbHRlckRhdGE6Ui5waWNrKFsnX2lkJywgJ25hbWUnXSksIC8vZnVuY3Rpb24gcGVyIGZpbHRyYXJlIGkgZmllbGRzIGRlZ2xpIGl0ZW0sIHRpZW5lIHNvbG8gcXVlbGxpIGludGVyZXNzYW50aSBwZXIgbGEgdmlld1xuICAgIHN0b3JhZ2U6IG1haW5TdG9yYWdlLFxuICAgIHN0b3JhZ2VDb25maWc6IG1haW5TdG9yYWdlQ29uZmlnLFxuICAgIHN0b3JhZ2VDb2xsZWN0aW9uOiAoKSA9PiAnYXV0b3JpemF0aW9uc1ZpZXcnXG4gIH0sXG4gICdVc2VyUGVybWlzc2lvbic6IHtcbiAgICBlbnRpdHlOYW1lOiAnVXNlclBlcm1pc3Npb24nLFxuICAgIHByb3RvOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnL3NoYXJlZC9lbnRpdGllcy9QZXJtaXNzaW9uL2VudGl0eS5wcm90bycpLFxuICAgIHZhbGlkYXRpb25zUGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy9zaGFyZWQvZW50aXRpZXMvUGVybWlzc2lvbi8nKSxcbiAgICBzdG9yYWdlOiBtYWluU3RvcmFnZSxcbiAgICBzdG9yYWdlQ29uZmlnOiBtYWluU3RvcmFnZUNvbmZpZyxcbiAgICBzdG9yYWdlQ29sbGVjdGlvbjogKCkgPT4gJ1VzZXJQZXJtaXNzaW9ucydcbiAgICAvLyBwZXJtaXNzaW9uc0V4dHJhOiAoKSA9PiBbXG4gICAgLy8gICB7ZW50aXR5OiAnKicsIGFjdGlvbjogJyonLCB0eXBlOiAncm9sZUJhc2VkJywgcGVybWl0OiB0cnVlLCBmb3JjZTogdHJ1ZSwgcHJpb3JpdHk6IDAsIHJvbGVCYXNlZEFyZ3M6IHtyb2xlSWQ6ICdhZG1pbid9fSxcbiAgICAvLyAgIHtlbnRpdHk6ICcqJywgYWN0aW9uOiAnKicsIHR5cGU6ICd1c2VyQmFzZWQnLCBwZXJtaXQ6IHRydWUsIGZvcmNlOiB0cnVlLCBwcmlvcml0eTogMTAsIHVzZXJCYXNlZEFyZ3M6IHt1c2VySWQ6ICdhZG1pbid9fSxcbiAgICAvLyAgIHtlbnRpdHk6ICcqJywgYWN0aW9uOiAnKicsIHR5cGU6ICdjb250ZXh0QmFzZWQnLCBwZXJtaXQ6IHRydWUsIGZvcmNlOiB0cnVlLCBwcmlvcml0eTogMTAwLCBjb250ZXh0QmFzZWRBcmdzOiB7aXA6ICcxMjcuMC4wLjEnfX1cbiAgICAvLyBdXG4gIH0sXG4gICdVc2VyJzoge1xuICAgIGVudGl0eU5hbWU6ICdVc2VyJyxcbiAgICBwcm90bzogJy4vc2hhcmVkL2VudGl0aWVzL1VzZXIvZW50aXR5LnByb3RvJyxcbiAgICAvLyBtdXRhdGlvbnM6IHtcbiAgICAvLyAgIGNyZWF0ZToge1xuICAgIC8vICAgICB2YWxpZGF0aW9uU2NoZW1hOiAoKSA9PiByZXF1aXJlKCcuL3NoYXJlZC9lbnRpdGllcy9Vc2VyL2NyZWF0ZS5zY2hlbWEuanNvbicpLFxuICAgIC8vICAgICB2YWxpZGF0ZTogcmVxdWlyZShcIi4uL3ZhbGlkYXRlLmpzb25TY2hlbWFcIiksXG4gICAgLy8gICB9LFxuICAgIC8vICAgdXBkYXRlOiB7XG4gICAgLy8gICAgIHZhbGlkYXRpb25TY2hlbWE6ICgpID0+IHJlcXVpcmUoJy4vc2hhcmVkL2VudGl0aWVzL1VzZXIvdXBkYXRlLnNjaGVtYS5qc29uJyksXG4gICAgLy8gICAgIHZhbGlkYXRlOiByZXF1aXJlKFwiLi4vdmFsaWRhdGUuanNvblNjaGVtYVwiKSxcbiAgICAvLyAgIH1cbiAgICAvLyB9LFxuICAgIG11dGF0aW9uc1N0b3JhZ2U6IHtcbiAgICAgIHN0b3JhZ2U6IG1haW5TdG9yYWdlLFxuICAgICAgc3RvcmFnZUNvbmZpZzogbWFpblN0b3JhZ2VDb25maWcsXG4gICAgICBzdG9yYWdlQ29sbGVjdGlvbjogKCkgPT4gJ1VzZXJNdXRhdGlvbnMnXG4gICAgfSxcbiAgICBtdXRhdGlvbnNQYXRoOiAoKSA9PiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi9zaGFyZWQvZW50aXRpZXMvVXNlci9tdXRhdGlvbnMnKSxcbiAgICB2aWV3c1N0b3JhZ2U6IHtcbiAgICAgIHN0b3JhZ2U6IG1haW5TdG9yYWdlLFxuICAgICAgc3RvcmFnZUNvbmZpZzogbWFpblN0b3JhZ2VDb25maWcsXG4gICAgICBzdG9yYWdlQ29sbGVjdGlvbjogKCkgPT4gJ1VzZXJWaWV3c1N0b3JhZ2UnXG4gICAgfSxcbiAgICB2aWV3c1NuYXBzaG90c1N0b3JhZ2U6IHtcbiAgICAgIHN0b3JhZ2U6IG1haW5TdG9yYWdlLFxuICAgICAgc3RvcmFnZUNvbmZpZzogbWFpblN0b3JhZ2VDb25maWcsXG4gICAgICBzdG9yYWdlQ29sbGVjdGlvbjogKCkgPT4gJ1VzZXJWaWV3c1NuYXBzaG90cydcbiAgICB9LFxuICAgIHZpZXdzU25hcHNob3RzTWF4TXV0YXRpb25zOiAoKSA9PiAxMFxuICB9XG59XG4iXX0=