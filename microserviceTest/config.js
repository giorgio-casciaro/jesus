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
  instanceId: uuidV4(),
  name: 'testMicroservice',
  tags: 'public permissions',
  httpPort: 8080,
  httpPrivatePort: 8081,
  net: {
    netRegistry: require('./shared/netRegistry.json'),
    url: '0.0.0.0:8082'
  },
  NODE_ENV: 'development',
  logPath: 'microserviceTest/logs',
  debugActive: true,
  'autorizationsView': {
    filterData: R.pick(['_id', 'name']), // function per filtrare i fields degli item, tiene solo quelli interessanti per la view
    storage: mainStorage,
    storageConfig: mainStorageConfig,
    storageCollection: function storageCollection() {
      return 'autorizationsView';
    }
  },
  'UserPermission': {
    entityName: 'UserPermission',
    schema: path.join(__dirname, '/shared/entities/Permission/entity.schema.json'),
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
    schema: path.join(__dirname, '/shared/entities/User/entity.schema.json'),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbmZpZy5lczYiXSwibmFtZXMiOlsiUiIsInJlcXVpcmUiLCJwYXRoIiwidXVpZFY0IiwibWFpblN0b3JhZ2UiLCJtYWluU3RvcmFnZVR5cGUiLCJtYWluU3RvcmFnZUNvbmZpZyIsImpvaW4iLCJfX2Rpcm5hbWUiLCJtb2R1bGUiLCJleHBvcnRzIiwiaW5zdGFuY2VJZCIsIm5hbWUiLCJ0YWdzIiwiaHR0cFBvcnQiLCJodHRwUHJpdmF0ZVBvcnQiLCJuZXQiLCJuZXRSZWdpc3RyeSIsInVybCIsIk5PREVfRU5WIiwibG9nUGF0aCIsImRlYnVnQWN0aXZlIiwiZmlsdGVyRGF0YSIsInBpY2siLCJzdG9yYWdlIiwic3RvcmFnZUNvbmZpZyIsInN0b3JhZ2VDb2xsZWN0aW9uIiwiZW50aXR5TmFtZSIsInNjaGVtYSIsInZhbGlkYXRpb25zUGF0aCIsIm11dGF0aW9uc1N0b3JhZ2UiLCJtdXRhdGlvbnNQYXRoIiwidmlld3NTdG9yYWdlIiwidmlld3NTbmFwc2hvdHNTdG9yYWdlIiwidmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnMiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQSxJQUFJQyxPQUFPRCxRQUFRLE1BQVIsQ0FBWDtBQUNBLElBQU1FLFNBQVNGLFFBQVEsU0FBUixDQUFmOztBQUVBLElBQUlHLGNBQWNILFFBQVEscUJBQVIsQ0FBbEI7QUFDQSxJQUFJSSxrQkFBa0IsVUFBdEI7QUFDQSxJQUFJQyxvQkFBb0I7QUFDdEJKLFFBQU1BLEtBQUtLLElBQUwsQ0FBVUMsU0FBVixFQUFxQixRQUFyQjtBQURnQixDQUF4QjtBQUdBQyxPQUFPQyxPQUFQLEdBQWlCO0FBQ2ZDLGNBQVlSLFFBREc7QUFFZlMsUUFBTSxrQkFGUztBQUdmQyxRQUFNLG9CQUhTO0FBSWZDLFlBQVUsSUFKSztBQUtmQyxtQkFBaUIsSUFMRjtBQU1mQyxPQUFLO0FBQ0hDLGlCQUFhaEIsUUFBUSwyQkFBUixDQURWO0FBRUhpQixTQUFLO0FBRkYsR0FOVTtBQVVmQyxZQUFVLGFBVks7QUFXZkMsV0FBUyx1QkFYTTtBQVlmQyxlQUFhLElBWkU7QUFhZix1QkFBcUI7QUFDbkJDLGdCQUFZdEIsRUFBRXVCLElBQUYsQ0FBTyxDQUFDLEtBQUQsRUFBUSxNQUFSLENBQVAsQ0FETyxFQUNrQjtBQUNyQ0MsYUFBU3BCLFdBRlU7QUFHbkJxQixtQkFBZW5CLGlCQUhJO0FBSW5Cb0IsdUJBQW1CO0FBQUEsYUFBTSxtQkFBTjtBQUFBO0FBSkEsR0FiTjtBQW1CZixvQkFBa0I7QUFDaEJDLGdCQUFZLGdCQURJO0FBRWhCQyxZQUFRMUIsS0FBS0ssSUFBTCxDQUFVQyxTQUFWLEVBQXFCLGdEQUFyQixDQUZRO0FBR2hCcUIscUJBQWlCM0IsS0FBS0ssSUFBTCxDQUFVQyxTQUFWLEVBQXFCLDhCQUFyQixDQUhEO0FBSWhCZ0IsYUFBU3BCLFdBSk87QUFLaEJxQixtQkFBZW5CLGlCQUxDO0FBTWhCb0IsdUJBQW1CO0FBQUEsYUFBTSxpQkFBTjtBQUFBO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFYZ0IsR0FuQkg7QUFnQ2YsVUFBUTtBQUNOQyxnQkFBWSxNQUROO0FBRU5DLFlBQVExQixLQUFLSyxJQUFMLENBQVVDLFNBQVYsRUFBcUIsMENBQXJCLENBRkY7QUFHTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBc0Isc0JBQWtCO0FBQ2hCTixlQUFTcEIsV0FETztBQUVoQnFCLHFCQUFlbkIsaUJBRkM7QUFHaEJvQix5QkFBbUI7QUFBQSxlQUFNLGVBQU47QUFBQTtBQUhILEtBYlo7QUFrQk5LLG1CQUFlO0FBQUEsYUFBTTdCLEtBQUtLLElBQUwsQ0FBVUMsU0FBVixFQUFxQixrQ0FBckIsQ0FBTjtBQUFBLEtBbEJUO0FBbUJOd0Isa0JBQWM7QUFDWlIsZUFBU3BCLFdBREc7QUFFWnFCLHFCQUFlbkIsaUJBRkg7QUFHWm9CLHlCQUFtQjtBQUFBLGVBQU0sa0JBQU47QUFBQTtBQUhQLEtBbkJSO0FBd0JOTywyQkFBdUI7QUFDckJULGVBQVNwQixXQURZO0FBRXJCcUIscUJBQWVuQixpQkFGTTtBQUdyQm9CLHlCQUFtQjtBQUFBLGVBQU0sb0JBQU47QUFBQTtBQUhFLEtBeEJqQjtBQTZCTlEsZ0NBQTRCO0FBQUEsYUFBTSxFQUFOO0FBQUE7QUE3QnRCO0FBaENPLENBQWpCIiwiZmlsZSI6ImNvbmZpZy5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgUiA9IHJlcXVpcmUoJ3JhbWRhJylcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5jb25zdCB1dWlkVjQgPSByZXF1aXJlKCd1dWlkL3Y0JylcblxudmFyIG1haW5TdG9yYWdlID0gcmVxdWlyZSgnLi4vc3RvcmFnZS5pbm1lbW9yeScpXG52YXIgbWFpblN0b3JhZ2VUeXBlID0gJ2lubWVtb3J5J1xudmFyIG1haW5TdG9yYWdlQ29uZmlnID0ge1xuICBwYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnZmlsZURiJylcbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBpbnN0YW5jZUlkOiB1dWlkVjQoKSxcbiAgbmFtZTogJ3Rlc3RNaWNyb3NlcnZpY2UnLFxuICB0YWdzOiAncHVibGljIHBlcm1pc3Npb25zJyxcbiAgaHR0cFBvcnQ6IDgwODAsXG4gIGh0dHBQcml2YXRlUG9ydDogODA4MSxcbiAgbmV0OiB7XG4gICAgbmV0UmVnaXN0cnk6IHJlcXVpcmUoJy4vc2hhcmVkL25ldFJlZ2lzdHJ5Lmpzb24nKSxcbiAgICB1cmw6ICcwLjAuMC4wOjgwODInXG4gIH0sXG4gIE5PREVfRU5WOiAnZGV2ZWxvcG1lbnQnLFxuICBsb2dQYXRoOiAnbWljcm9zZXJ2aWNlVGVzdC9sb2dzJyxcbiAgZGVidWdBY3RpdmU6IHRydWUsXG4gICdhdXRvcml6YXRpb25zVmlldyc6IHtcbiAgICBmaWx0ZXJEYXRhOiBSLnBpY2soWydfaWQnLCAnbmFtZSddKSwgLy8gZnVuY3Rpb24gcGVyIGZpbHRyYXJlIGkgZmllbGRzIGRlZ2xpIGl0ZW0sIHRpZW5lIHNvbG8gcXVlbGxpIGludGVyZXNzYW50aSBwZXIgbGEgdmlld1xuICAgIHN0b3JhZ2U6IG1haW5TdG9yYWdlLFxuICAgIHN0b3JhZ2VDb25maWc6IG1haW5TdG9yYWdlQ29uZmlnLFxuICAgIHN0b3JhZ2VDb2xsZWN0aW9uOiAoKSA9PiAnYXV0b3JpemF0aW9uc1ZpZXcnXG4gIH0sXG4gICdVc2VyUGVybWlzc2lvbic6IHtcbiAgICBlbnRpdHlOYW1lOiAnVXNlclBlcm1pc3Npb24nLFxuICAgIHNjaGVtYTogcGF0aC5qb2luKF9fZGlybmFtZSwgJy9zaGFyZWQvZW50aXRpZXMvUGVybWlzc2lvbi9lbnRpdHkuc2NoZW1hLmpzb24nKSxcbiAgICB2YWxpZGF0aW9uc1BhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcvc2hhcmVkL2VudGl0aWVzL1Blcm1pc3Npb24vJyksXG4gICAgc3RvcmFnZTogbWFpblN0b3JhZ2UsXG4gICAgc3RvcmFnZUNvbmZpZzogbWFpblN0b3JhZ2VDb25maWcsXG4gICAgc3RvcmFnZUNvbGxlY3Rpb246ICgpID0+ICdVc2VyUGVybWlzc2lvbnMnXG4gICAgLy8gcGVybWlzc2lvbnNFeHRyYTogKCkgPT4gW1xuICAgIC8vICAge2VudGl0eTogJyonLCBhY3Rpb246ICcqJywgdHlwZTogJ3JvbGVCYXNlZCcsIHBlcm1pdDogdHJ1ZSwgZm9yY2U6IHRydWUsIHByaW9yaXR5OiAwLCByb2xlQmFzZWRBcmdzOiB7cm9sZUlkOiAnYWRtaW4nfX0sXG4gICAgLy8gICB7ZW50aXR5OiAnKicsIGFjdGlvbjogJyonLCB0eXBlOiAndXNlckJhc2VkJywgcGVybWl0OiB0cnVlLCBmb3JjZTogdHJ1ZSwgcHJpb3JpdHk6IDEwLCB1c2VyQmFzZWRBcmdzOiB7dXNlcklkOiAnYWRtaW4nfX0sXG4gICAgLy8gICB7ZW50aXR5OiAnKicsIGFjdGlvbjogJyonLCB0eXBlOiAnY29udGV4dEJhc2VkJywgcGVybWl0OiB0cnVlLCBmb3JjZTogdHJ1ZSwgcHJpb3JpdHk6IDEwMCwgY29udGV4dEJhc2VkQXJnczoge2lwOiAnMTI3LjAuMC4xJ319XG4gICAgLy8gXVxuICB9LFxuICAnVXNlcic6IHtcbiAgICBlbnRpdHlOYW1lOiAnVXNlcicsXG4gICAgc2NoZW1hOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnL3NoYXJlZC9lbnRpdGllcy9Vc2VyL2VudGl0eS5zY2hlbWEuanNvbicpLFxuICAgIC8vIG11dGF0aW9uczoge1xuICAgIC8vICAgY3JlYXRlOiB7XG4gICAgLy8gICAgIHZhbGlkYXRpb25TY2hlbWE6ICgpID0+IHJlcXVpcmUoJy4vc2hhcmVkL2VudGl0aWVzL1VzZXIvY3JlYXRlLnNjaGVtYS5qc29uJyksXG4gICAgLy8gICAgIHZhbGlkYXRlOiByZXF1aXJlKFwiLi4vdmFsaWRhdGUuanNvblNjaGVtYVwiKSxcbiAgICAvLyAgIH0sXG4gICAgLy8gICB1cGRhdGU6IHtcbiAgICAvLyAgICAgdmFsaWRhdGlvblNjaGVtYTogKCkgPT4gcmVxdWlyZSgnLi9zaGFyZWQvZW50aXRpZXMvVXNlci91cGRhdGUuc2NoZW1hLmpzb24nKSxcbiAgICAvLyAgICAgdmFsaWRhdGU6IHJlcXVpcmUoXCIuLi92YWxpZGF0ZS5qc29uU2NoZW1hXCIpLFxuICAgIC8vICAgfVxuICAgIC8vIH0sXG4gICAgbXV0YXRpb25zU3RvcmFnZToge1xuICAgICAgc3RvcmFnZTogbWFpblN0b3JhZ2UsXG4gICAgICBzdG9yYWdlQ29uZmlnOiBtYWluU3RvcmFnZUNvbmZpZyxcbiAgICAgIHN0b3JhZ2VDb2xsZWN0aW9uOiAoKSA9PiAnVXNlck11dGF0aW9ucydcbiAgICB9LFxuICAgIG11dGF0aW9uc1BhdGg6ICgpID0+IHBhdGguam9pbihfX2Rpcm5hbWUsICcuL3NoYXJlZC9lbnRpdGllcy9Vc2VyL211dGF0aW9ucycpLFxuICAgIHZpZXdzU3RvcmFnZToge1xuICAgICAgc3RvcmFnZTogbWFpblN0b3JhZ2UsXG4gICAgICBzdG9yYWdlQ29uZmlnOiBtYWluU3RvcmFnZUNvbmZpZyxcbiAgICAgIHN0b3JhZ2VDb2xsZWN0aW9uOiAoKSA9PiAnVXNlclZpZXdzU3RvcmFnZSdcbiAgICB9LFxuICAgIHZpZXdzU25hcHNob3RzU3RvcmFnZToge1xuICAgICAgc3RvcmFnZTogbWFpblN0b3JhZ2UsXG4gICAgICBzdG9yYWdlQ29uZmlnOiBtYWluU3RvcmFnZUNvbmZpZyxcbiAgICAgIHN0b3JhZ2VDb2xsZWN0aW9uOiAoKSA9PiAnVXNlclZpZXdzU25hcHNob3RzJ1xuICAgIH0sXG4gICAgdmlld3NTbmFwc2hvdHNNYXhNdXRhdGlvbnM6ICgpID0+IDEwXG4gIH1cbn1cbiJdfQ==