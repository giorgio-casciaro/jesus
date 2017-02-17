'use strict';

var getValuePromise = require('./jesus').getValuePromise;
var checkRequired = require('./jesus').checkRequired;
var path = require('path');

module.exports = function getEntityBasePackage(CONFIG, DI) {
  var PACKAGE, entityName, storagePackage, validationsPath, updateValidationFile;
  return regeneratorRuntime.async(function getEntityBasePackage$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          PACKAGE = 'entity.base';

          CONFIG = checkRequired(CONFIG, ['entityName', 'validationsPath'], PACKAGE);
          DI = checkRequired(DI, ['throwError'], PACKAGE);
          _context3.next = 5;
          return regeneratorRuntime.awrap(getValuePromise(CONFIG.entityName));

        case 5:
          entityName = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(CONFIG.storage(CONFIG, DI));

        case 8:
          storagePackage = _context3.sent;
          _context3.next = 11;
          return regeneratorRuntime.awrap(getValuePromise(CONFIG.validationsPath));

        case 11:
          validationsPath = _context3.sent;
          updateValidationFile = path.join(validationsPath, 'update.schema.json');
          return _context3.abrupt('return', {
            update: function update(_ref) {
              var itemsIds = _ref.itemsIds,
                  items = _ref.items;
              var validate, validationResults;
              return regeneratorRuntime.async(function update$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;

                      if (!(!itemsIds || !items)) {
                        _context.next = 3;
                        break;
                      }

                      throw new Error('ARG itemsIds, items are required');

                    case 3:
                      validate = require('./validate.jsonSchema');
                      _context.next = 6;
                      return regeneratorRuntime.awrap(validate({ items: items, validationSchema: updateValidationFile, throwIfFileNotFounded: true }));

                    case 6:
                      validationResults = _context.sent;
                      _context.next = 9;
                      return regeneratorRuntime.awrap(storagePackage.update({
                        queriesArray: R.map(function (itemId) {
                          return { '_id': itemId };
                        }, itemsIds),
                        dataArray: items,
                        insertIfNotExists: true }));

                    case 9:
                      DI.debug({ msg: 'ENTITY: ' + entityName + ' update()', context: PACKAGE, debug: { itemsIds: itemsIds, items: items } });
                      return _context.abrupt('return', itemsIds);

                    case 13:
                      _context.prev = 13;
                      _context.t0 = _context['catch'](0);

                      DI.throwError('ENTITY: ' + entityName + ' update()', _context.t0, { itemsIds: itemsIds, items: items });

                    case 16:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this, [[0, 13]]);
            },
            read: function read(_ref2) {
              var itemsIds = _ref2.itemsIds;
              var items;
              return regeneratorRuntime.async(function read$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.prev = 0;

                      if (itemsIds) {
                        _context2.next = 3;
                        break;
                      }

                      throw new Error('ENTITY: ' + entityName + ' read(itemsIds)  required args');

                    case 3:
                      _context2.next = 5;
                      return regeneratorRuntime.awrap(storagePackage.get({ ids: itemsIds }));

                    case 5:
                      items = _context2.sent;

                      DI.debug({ msg: 'ENTITY: ' + entityName + ' read()', context: PACKAGE, debug: { itemsIds: itemsIds, items: items } });
                      return _context2.abrupt('return', items);

                    case 10:
                      _context2.prev = 10;
                      _context2.t0 = _context2['catch'](0);

                      DI.throwError('ENTITY: ' + entityName + ' read()', _context2.t0, { itemsIds: itemsIds });

                    case 13:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, null, this, [[0, 10]]);
            }
          });

        case 14:
        case 'end':
          return _context3.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eS5iYXNlLmVzNiJdLCJuYW1lcyI6WyJnZXRWYWx1ZVByb21pc2UiLCJyZXF1aXJlIiwiY2hlY2tSZXF1aXJlZCIsInBhdGgiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0RW50aXR5QmFzZVBhY2thZ2UiLCJDT05GSUciLCJESSIsIlBBQ0tBR0UiLCJlbnRpdHlOYW1lIiwic3RvcmFnZSIsInN0b3JhZ2VQYWNrYWdlIiwidmFsaWRhdGlvbnNQYXRoIiwidXBkYXRlVmFsaWRhdGlvbkZpbGUiLCJqb2luIiwidXBkYXRlIiwiaXRlbXNJZHMiLCJpdGVtcyIsIkVycm9yIiwidmFsaWRhdGUiLCJ2YWxpZGF0aW9uU2NoZW1hIiwidGhyb3dJZkZpbGVOb3RGb3VuZGVkIiwidmFsaWRhdGlvblJlc3VsdHMiLCJxdWVyaWVzQXJyYXkiLCJSIiwibWFwIiwiaXRlbUlkIiwiZGF0YUFycmF5IiwiaW5zZXJ0SWZOb3RFeGlzdHMiLCJkZWJ1ZyIsIm1zZyIsImNvbnRleHQiLCJ0aHJvd0Vycm9yIiwicmVhZCIsImdldCIsImlkcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQSxJQUFNQSxrQkFBa0JDLFFBQVEsU0FBUixFQUFtQkQsZUFBM0M7QUFDQSxJQUFNRSxnQkFBZ0JELFFBQVEsU0FBUixFQUFtQkMsYUFBekM7QUFDQSxJQUFJQyxPQUFPRixRQUFRLE1BQVIsQ0FBWDs7QUFFQUcsT0FBT0MsT0FBUCxHQUFpQixTQUFlQyxvQkFBZixDQUFxQ0MsTUFBckMsRUFBNkNDLEVBQTdDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUNUQyxpQkFEUyxHQUNDLGFBREQ7O0FBRWZGLG1CQUFTTCxjQUFjSyxNQUFkLEVBQXNCLENBQUMsWUFBRCxFQUFlLGlCQUFmLENBQXRCLEVBQXlERSxPQUF6RCxDQUFUO0FBQ0FELGVBQUtOLGNBQWNNLEVBQWQsRUFBa0IsQ0FBRSxZQUFGLENBQWxCLEVBQW1DQyxPQUFuQyxDQUFMO0FBSGU7QUFBQSwwQ0FJUVQsZ0JBQWdCTyxPQUFPRyxVQUF2QixDQUpSOztBQUFBO0FBSVhBLG9CQUpXO0FBQUE7QUFBQSwwQ0FLWUgsT0FBT0ksT0FBUCxDQUFlSixNQUFmLEVBQXVCQyxFQUF2QixDQUxaOztBQUFBO0FBS1hJLHdCQUxXO0FBQUE7QUFBQSwwQ0FNYVosZ0JBQWdCTyxPQUFPTSxlQUF2QixDQU5iOztBQUFBO0FBTVhBLHlCQU5XO0FBT1hDLDhCQVBXLEdBT1lYLEtBQUtZLElBQUwsQ0FBVUYsZUFBVix1QkFQWjtBQUFBLDRDQVNSO0FBQ0NHLGtCQUREO0FBQUEsa0JBQ1VDLFFBRFYsUUFDVUEsUUFEVjtBQUFBLGtCQUNvQkMsS0FEcEIsUUFDb0JBLEtBRHBCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUFBLDRCQUdHLENBQUNELFFBQUQsSUFBYSxDQUFDQyxLQUhqQjtBQUFBO0FBQUE7QUFBQTs7QUFBQSw0QkFHOEIsSUFBSUMsS0FBSixDQUFVLGtDQUFWLENBSDlCOztBQUFBO0FBSUdDLDhCQUpILEdBSWNuQixRQUFRLHVCQUFSLENBSmQ7QUFBQTtBQUFBLHNEQUs2Qm1CLFNBQVMsRUFBQ0YsWUFBRCxFQUFRRyxrQkFBa0JQLG9CQUExQixFQUFnRFEsdUJBQXVCLElBQXZFLEVBQVQsQ0FMN0I7O0FBQUE7QUFLR0MsdUNBTEg7QUFBQTtBQUFBLHNEQU1LWCxlQUFlSSxNQUFmLENBQXNCO0FBQzFCUSxzQ0FBY0MsRUFBRUMsR0FBRixDQUFNLFVBQUNDLE1BQUQ7QUFBQSxpQ0FBYSxFQUFDLE9BQU9BLE1BQVIsRUFBYjtBQUFBLHlCQUFOLEVBQXFDVixRQUFyQyxDQURZO0FBRTFCVyxtQ0FBV1YsS0FGZTtBQUcxQlcsMkNBQW1CLElBSE8sRUFBdEIsQ0FOTDs7QUFBQTtBQVVEckIseUJBQUdzQixLQUFILENBQVMsRUFBQ0Msa0JBQWdCckIsVUFBaEIsY0FBRCxFQUF3Q3NCLFNBQVN2QixPQUFqRCxFQUEwRHFCLE9BQU8sRUFBQ2Isa0JBQUQsRUFBV0MsWUFBWCxFQUFqRSxFQUFUO0FBVkMsdURBV01ELFFBWE47O0FBQUE7QUFBQTtBQUFBOztBQWFEVCx5QkFBR3lCLFVBQUgsY0FBeUJ2QixVQUF6Qiw2QkFBdUQsRUFBQ08sa0JBQUQsRUFBV0MsWUFBWCxFQUF2RDs7QUFiQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQWdCQ2dCLGdCQWhCRDtBQUFBLGtCQWdCUWpCLFFBaEJSLFNBZ0JRQSxRQWhCUjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQSwwQkFrQklBLFFBbEJKO0FBQUE7QUFBQTtBQUFBOztBQUFBLDRCQWtCb0IsSUFBSUUsS0FBSixjQUFxQlQsVUFBckIsb0NBbEJwQjs7QUFBQTtBQUFBO0FBQUEsc0RBbUJpQkUsZUFBZXVCLEdBQWYsQ0FBbUIsRUFBQ0MsS0FBS25CLFFBQU4sRUFBbkIsQ0FuQmpCOztBQUFBO0FBbUJHQywyQkFuQkg7O0FBb0JEVix5QkFBR3NCLEtBQUgsQ0FBUyxFQUFDQyxrQkFBZ0JyQixVQUFoQixZQUFELEVBQXNDc0IsU0FBU3ZCLE9BQS9DLEVBQXdEcUIsT0FBTyxFQUFDYixrQkFBRCxFQUFXQyxZQUFYLEVBQS9ELEVBQVQ7QUFwQkMsd0RBcUJNQSxLQXJCTjs7QUFBQTtBQUFBO0FBQUE7O0FBdUJEVix5QkFBR3lCLFVBQUgsY0FBeUJ2QixVQUF6Qiw0QkFBcUQsRUFBQ08sa0JBQUQsRUFBckQ7O0FBdkJDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsV0FUUTs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxDQUFqQiIsImZpbGUiOiJlbnRpdHkuYmFzZS5lczYiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcbnZhciBwYXRoID0gcmVxdWlyZSgncGF0aCcpXG5cbm1vZHVsZS5leHBvcnRzID0gYXN5bmMgZnVuY3Rpb24gZ2V0RW50aXR5QmFzZVBhY2thZ2UgKENPTkZJRywgREkpIHtcbiAgY29uc3QgUEFDS0FHRSA9ICdlbnRpdHkuYmFzZSdcbiAgQ09ORklHID0gY2hlY2tSZXF1aXJlZChDT05GSUcsIFsnZW50aXR5TmFtZScsICd2YWxpZGF0aW9uc1BhdGgnXSwgUEFDS0FHRSlcbiAgREkgPSBjaGVja1JlcXVpcmVkKERJLCBbICd0aHJvd0Vycm9yJ10sIFBBQ0tBR0UpXG4gIHZhciBlbnRpdHlOYW1lID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy5lbnRpdHlOYW1lKVxuICB2YXIgc3RvcmFnZVBhY2thZ2UgPSBhd2FpdCBDT05GSUcuc3RvcmFnZShDT05GSUcsIERJKVxuICB2YXIgdmFsaWRhdGlvbnNQYXRoID0gYXdhaXQgZ2V0VmFsdWVQcm9taXNlKENPTkZJRy52YWxpZGF0aW9uc1BhdGgpXG4gIHZhciB1cGRhdGVWYWxpZGF0aW9uRmlsZSA9IHBhdGguam9pbih2YWxpZGF0aW9uc1BhdGgsIGB1cGRhdGUuc2NoZW1hLmpzb25gKVxuXG4gIHJldHVybiB7XG4gICAgYXN5bmMgdXBkYXRlICh7aXRlbXNJZHMsIGl0ZW1zfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFpdGVtc0lkcyB8fCAhaXRlbXMpIHRocm93IG5ldyBFcnJvcignQVJHIGl0ZW1zSWRzLCBpdGVtcyBhcmUgcmVxdWlyZWQnKVxuICAgICAgICB2YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL3ZhbGlkYXRlLmpzb25TY2hlbWEnKVxuICAgICAgICB2YXIgdmFsaWRhdGlvblJlc3VsdHMgPSBhd2FpdCB2YWxpZGF0ZSh7aXRlbXMsIHZhbGlkYXRpb25TY2hlbWE6IHVwZGF0ZVZhbGlkYXRpb25GaWxlLCB0aHJvd0lmRmlsZU5vdEZvdW5kZWQ6IHRydWV9KVxuICAgICAgICBhd2FpdCBzdG9yYWdlUGFja2FnZS51cGRhdGUoe1xuICAgICAgICAgIHF1ZXJpZXNBcnJheTogUi5tYXAoKGl0ZW1JZCkgPT4gKHsnX2lkJzogaXRlbUlkfSksIGl0ZW1zSWRzKSxcbiAgICAgICAgICBkYXRhQXJyYXk6IGl0ZW1zLFxuICAgICAgICAgIGluc2VydElmTm90RXhpc3RzOiB0cnVlfSlcbiAgICAgICAgREkuZGVidWcoe21zZzogYEVOVElUWTogJHtlbnRpdHlOYW1lfSB1cGRhdGUoKWAsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7aXRlbXNJZHMsIGl0ZW1zfX0pXG4gICAgICAgIHJldHVybiBpdGVtc0lkc1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgREkudGhyb3dFcnJvcihgRU5USVRZOiAke2VudGl0eU5hbWV9IHVwZGF0ZSgpYCwgZXJyb3IsIHtpdGVtc0lkcywgaXRlbXN9KVxuICAgICAgfVxuICAgIH0sXG4gICAgYXN5bmMgcmVhZCAoe2l0ZW1zSWRzfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFpdGVtc0lkcykgdGhyb3cgbmV3IEVycm9yKGBFTlRJVFk6ICR7ZW50aXR5TmFtZX0gcmVhZChpdGVtc0lkcykgIHJlcXVpcmVkIGFyZ3NgKVxuICAgICAgICB2YXIgaXRlbXMgPSBhd2FpdCBzdG9yYWdlUGFja2FnZS5nZXQoe2lkczogaXRlbXNJZHN9KVxuICAgICAgICBESS5kZWJ1Zyh7bXNnOiBgRU5USVRZOiAke2VudGl0eU5hbWV9IHJlYWQoKWAsIGNvbnRleHQ6IFBBQ0tBR0UsIGRlYnVnOiB7aXRlbXNJZHMsIGl0ZW1zfX0pXG4gICAgICAgIHJldHVybiBpdGVtc1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgREkudGhyb3dFcnJvcihgRU5USVRZOiAke2VudGl0eU5hbWV9IHJlYWQoKWAsIGVycm9yLCB7aXRlbXNJZHN9KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19