'use strict';

var R = require('ramda');
// var path = require('path')
// const uuidV4 = require('uuid/v4')
var getValuePromise = require('./jesus').getValuePromise;
var checkRequired = require('./jesus').checkRequired;

module.exports = function getEntityCqrsPackage(CONFIG, DI) {
  var PACKAGE, mutationsStoragePackage, viewsStoragePackage, viewsSnapshotsStoragePackage, mutationsPackage, viewsPackage, entityName;
  return regeneratorRuntime.async(function getEntityCqrsPackage$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          PACKAGE = 'entity.cqrs';

          CONFIG = checkRequired(CONFIG, ['entityName', 'mutationsStorage', 'viewsStorage', 'viewsSnapshotsStorage'], PACKAGE);
          DI = checkRequired(DI, ['throwError', 'debug', 'emitEvent'], PACKAGE);

          _context4.next = 5;
          return regeneratorRuntime.awrap(CONFIG.mutationsStorage.storage(CONFIG.mutationsStorage, DI));

        case 5:
          mutationsStoragePackage = _context4.sent;
          _context4.next = 8;
          return regeneratorRuntime.awrap(CONFIG.viewsStorage.storage(CONFIG.viewsStorage, DI));

        case 8:
          viewsStoragePackage = _context4.sent;
          _context4.next = 11;
          return regeneratorRuntime.awrap(CONFIG.viewsSnapshotsStorage.storage(CONFIG.viewsSnapshotsStorage, DI));

        case 11:
          viewsSnapshotsStoragePackage = _context4.sent;
          _context4.next = 14;
          return regeneratorRuntime.awrap(require('./mutations.cqrs')(CONFIG, R.merge(DI, { mutationsStoragePackage: mutationsStoragePackage })));

        case 14:
          mutationsPackage = _context4.sent;
          _context4.next = 17;
          return regeneratorRuntime.awrap(require('./views.cqrs')(CONFIG, R.merge(DI, { viewsStoragePackage: viewsStoragePackage, viewsSnapshotsStoragePackage: viewsSnapshotsStoragePackage, mutationsPackage: mutationsPackage })));

        case 17:
          viewsPackage = _context4.sent;
          _context4.next = 20;
          return regeneratorRuntime.awrap(getValuePromise(CONFIG.entityName));

        case 20:
          entityName = _context4.sent;
          return _context4.abrupt('return', {
            mutate: function mutate(_ref) {
              var itemsIds = _ref.itemsIds,
                  items = _ref.items,
                  _ref$mutation = _ref.mutation,
                  mutation = _ref$mutation === undefined ? 'update' : _ref$mutation;
              var itemsMutations;
              return regeneratorRuntime.async(function mutate$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.prev = 0;

                      if (!(!itemsIds || !mutation)) {
                        _context.next = 3;
                        break;
                      }

                      throw new Error('ARG itemsIds, items, mutation are required');

                    case 3:
                      _context.next = 5;
                      return regeneratorRuntime.awrap(mutationsPackage.mutate({ mutation: mutation, itemsIds: itemsIds, items: items }));

                    case 5:
                      itemsMutations = _context.sent;

                      DI.debug({ msg: 'ENTITY: ' + entityName + ' mutate()', context: PACKAGE, debug: { itemsMutations: itemsMutations } });
                      DI.emitEvent({ name: 'mutated', data: { entity: entityName, itemsIds: itemsIds, mutation: mutation } });
                      return _context.abrupt('return', itemsMutations);

                    case 11:
                      _context.prev = 11;
                      _context.t0 = _context['catch'](0);

                      DI.throwError('ENTITY: ' + entityName + ' mutate()', _context.t0, { itemsIds: itemsIds, items: items, mutation: mutation });

                    case 14:
                    case 'end':
                      return _context.stop();
                  }
                }
              }, null, this, [[0, 11]]);
            },
            read: function read(_ref2) {
              var itemsIds = _ref2.itemsIds;
              var items;
              return regeneratorRuntime.async(function read$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.prev = 0;

                      if (!(!itemsIds || !itemsIds.length)) {
                        _context2.next = 3;
                        break;
                      }

                      throw new Error('ENTITY: ' + entityName + ' read(itemsIds)  required args');

                    case 3:
                      _context2.next = 5;
                      return regeneratorRuntime.awrap(viewsPackage.get({ ids: itemsIds }));

                    case 5:
                      items = _context2.sent;

                      DI.debug({ msg: 'ENTITY: ' + entityName + ' read()', context: PACKAGE, debug: { itemsIds: itemsIds, items: items } });
                      DI.emitEvent({ name: 'readed', data: { entity: entityName, itemsIds: itemsIds } });
                      return _context2.abrupt('return', items);

                    case 11:
                      _context2.prev = 11;
                      _context2.t0 = _context2['catch'](0);

                      DI.throwError('ENTITY: ' + entityName + ' read()', _context2.t0, { itemsIds: itemsIds });

                    case 14:
                    case 'end':
                      return _context2.stop();
                  }
                }
              }, null, this, [[0, 11]]);
            },
            refreshViews: function refreshViews(_ref3) {
              var itemsIds = _ref3.itemsIds,
                  loadSnapshot = _ref3.loadSnapshot,
                  loadMutations = _ref3.loadMutations,
                  addMutations = _ref3.addMutations;
              return regeneratorRuntime.async(function refreshViews$(_context3) {
                while (1) {
                  switch (_context3.prev = _context3.next) {
                    case 0:
                      _context3.prev = 0;
                      _context3.next = 3;
                      return regeneratorRuntime.awrap(viewsPackage.refreshItemsViews({ itemsIds: itemsIds, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations }));

                    case 3:
                      DI.emitEvent({ name: 'viewsUpdated', data: { entity: entityName, itemsIds: itemsIds } });
                      _context3.next = 9;
                      break;

                    case 6:
                      _context3.prev = 6;
                      _context3.t0 = _context3['catch'](0);

                      DI.throwError('ENTITY: ' + entityName + ' refreshViews()', _context3.t0, { itemsIds: itemsIds, loadSnapshot: loadSnapshot, loadMutations: loadMutations, addMutations: addMutations });

                    case 9:
                    case 'end':
                      return _context3.stop();
                  }
                }
              }, null, this, [[0, 6]]);
            }
          });

        case 22:
        case 'end':
          return _context4.stop();
      }
    }
  }, null, this);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudGl0eS5jcXJzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsImdldFZhbHVlUHJvbWlzZSIsImNoZWNrUmVxdWlyZWQiLCJtb2R1bGUiLCJleHBvcnRzIiwiZ2V0RW50aXR5Q3Fyc1BhY2thZ2UiLCJDT05GSUciLCJESSIsIlBBQ0tBR0UiLCJtdXRhdGlvbnNTdG9yYWdlIiwic3RvcmFnZSIsIm11dGF0aW9uc1N0b3JhZ2VQYWNrYWdlIiwidmlld3NTdG9yYWdlIiwidmlld3NTdG9yYWdlUGFja2FnZSIsInZpZXdzU25hcHNob3RzU3RvcmFnZSIsInZpZXdzU25hcHNob3RzU3RvcmFnZVBhY2thZ2UiLCJtZXJnZSIsIm11dGF0aW9uc1BhY2thZ2UiLCJ2aWV3c1BhY2thZ2UiLCJlbnRpdHlOYW1lIiwibXV0YXRlIiwiaXRlbXNJZHMiLCJpdGVtcyIsIm11dGF0aW9uIiwiRXJyb3IiLCJpdGVtc011dGF0aW9ucyIsImRlYnVnIiwibXNnIiwiY29udGV4dCIsImVtaXRFdmVudCIsIm5hbWUiLCJkYXRhIiwiZW50aXR5IiwidGhyb3dFcnJvciIsInJlYWQiLCJsZW5ndGgiLCJnZXQiLCJpZHMiLCJyZWZyZXNoVmlld3MiLCJsb2FkU25hcHNob3QiLCJsb2FkTXV0YXRpb25zIiwiYWRkTXV0YXRpb25zIiwicmVmcmVzaEl0ZW1zVmlld3MiXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSUEsSUFBSUMsUUFBUSxPQUFSLENBQVI7QUFDQTtBQUNBO0FBQ0EsSUFBTUMsa0JBQWtCRCxRQUFRLFNBQVIsRUFBbUJDLGVBQTNDO0FBQ0EsSUFBTUMsZ0JBQWdCRixRQUFRLFNBQVIsRUFBbUJFLGFBQXpDOztBQUVBQyxPQUFPQyxPQUFQLEdBQWlCLFNBQWVDLG9CQUFmLENBQXFDQyxNQUFyQyxFQUE2Q0MsRUFBN0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ1RDLGlCQURTLEdBQ0MsYUFERDs7QUFFZkYsbUJBQVNKLGNBQWNJLE1BQWQsRUFBc0IsQ0FBQyxZ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O0FBQUEsV0FqQlE7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBakIiLCJmaWxlIjoiZW50aXR5LmNxcnMuZXM2Iiwic291cmNlc0NvbnRlbnQiOlsidmFyIFIgPSByZXF1aXJlKCdyYW1kYScpXG4vLyB2YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuLy8gY29uc3QgdXVpZFY0ID0gcmVxdWlyZSgndXVpZC92NCcpXG5jb25zdCBnZXRWYWx1ZVByb21pc2UgPSByZXF1aXJlKCcuL2plc3VzJykuZ2V0VmFsdWVQcm9taXNlXG5jb25zdCBjaGVja1JlcXVpcmVkID0gcmVxdWlyZSgnLi9qZXN1cycpLmNoZWNrUmVxdWlyZWRcblxubW9kdWxlLmV4cG9ydHMgPSBhc3luYyBmdW5jdGlvbiBnZXRFbnRpdHlDcXJzUGFja2FnZSAoQ09ORklHLCBESSkge1xuICBjb25zdCBQQUNLQUdFID0gJ2VudGl0eS5jcXJzJ1xuICBDT05GSUcgPSBjaGVja1JlcXVpcmVkKENPTkZJRywgWydlbnRpdHlOYW1lJywgJ211dGF0aW9uc1N0b3JhZ2UnLCAndmlld3NTdG9yYWdlJywgJ3ZpZXdzU25hcHNob3RzU3RvcmFnZSddLCBQQUNLQUdFKVxuICBESSA9IGNoZWNrUmVxdWlyZWQoREksIFsndGhyb3dFcnJvcicsICdkZWJ1ZycsICdlbWl0RXZlbnQnXSwgUEFDS0FHRSlcblxuICB2YXIgbXV0YXRpb25zU3RvcmFnZVBhY2thZ2UgPSBhd2FpdCBDT05GSUcubXV0YXRpb25zU3RvcmFnZS5zdG9yYWdlKENPTkZJRy5tdXRhdGlvbnNTdG9yYWdlLCBESSlcbiAgdmFyIHZpZXdzU3RvcmFnZVBhY2thZ2UgPSBhd2FpdCBDT05GSUcudmlld3NTdG9yYWdlLnN0b3JhZ2UoQ09ORklHLnZpZXdzU3RvcmFnZSwgREkpXG4gIHZhciB2aWV3c1NuYXBzaG90c1N0b3JhZ2VQYWNrYWdlID0gYXdhaXQgQ09ORklHLnZpZXdzU25hcHNob3RzU3RvcmFnZS5zdG9yYWdlKENPTkZJRy52aWV3c1NuYXBzaG90c1N0b3JhZ2UsIERJKVxuICB2YXIgbXV0YXRpb25zUGFja2FnZSA9IGF3YWl0IHJlcXVpcmUoJy4vbXV0YXRpb25zLmNxcnMnKShDT05GSUcsIFIubWVyZ2UoREksIHttdXRhdGlvbnNTdG9yYWdlUGFja2FnZX0pKVxuICB2YXIgdmlld3NQYWNrYWdlID0gYXdhaXQgcmVxdWlyZSgnLi92aWV3cy5jcXJzJykoQ09ORklHLCBSLm1lcmdlKERJLCB7dmlld3NTdG9yYWdlUGFja2FnZSwgdmlld3NTbmFwc2hvdHNTdG9yYWdlUGFja2FnZSwgbXV0YXRpb25zUGFja2FnZX0pKVxuICAvLyB2YXIgdmFsaWRhdGUgPSBhd2FpdCByZXF1aXJlKCcuL3ZhbGlkYXRlJykoQ09ORklHLCBESSlcbiAgdmFyIGVudGl0eU5hbWUgPSBhd2FpdCBnZXRWYWx1ZVByb21pc2UoQ09ORklHLmVudGl0eU5hbWUpXG5cbiAgLy8gZnVuY3Rpb24gY2hlY2tJdGVtc0lkcyAoaXRlbXMpIHsgIC8vIElEIEFVVE9HRU5FUkFURUQgSUYgTk9UIElOQ0xVREVEXG4gIC8vICAgaXRlbXMuZm9yRWFjaCgoaXRlbSkgPT4geyBpZiAoIWl0ZW0uX2lkKWl0ZW0uX2lkID0gcmVxdWlyZSgndXVpZC92NCcpKCkgfSlcbiAgLy8gfVxuXG4gIHJldHVybiB7XG4gICAgYXN5bmMgbXV0YXRlICh7aXRlbXNJZHMsIGl0ZW1zLCBtdXRhdGlvbiA9ICd1cGRhdGUnfSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKCFpdGVtc0lkcyB8fCAhbXV0YXRpb24pIHRocm93IG5ldyBFcnJvcignQVJHIGl0ZW1zSWRzLCBpdGVtcywgbXV0YXRpb24gYXJlIHJlcXVpcmVkJylcbiAgICAgICAgLy8gYXdhaXQgdmFsaWRhdGUoe2l0ZW1zfSkvL1RPIEZJWCB2YWxpZGF0aW9uIHNwZWNpZmljYSBwZXIgbXV0YXRpb25cbiAgICAgICAgdmFyIGl0ZW1zTXV0YXRpb25zID0gYXdhaXQgbXV0YXRpb25zUGFja2FnZS5tdXRhdGUoe211dGF0aW9uLCBpdGVtc0lkcywgaXRlbXN9KVxuICAgICAgICBESS5kZWJ1Zyh7bXNnOiBgRU5USVRZOiAke2VudGl0eU5hbWV9IG11dGF0ZSgpYCwgY29udGV4dDogUEFDS0FHRSwgZGVidWc6IHtpdGVtc011dGF0aW9uc319KVxuICAgICAgICBESS5lbWl0RXZlbnQoe25hbWU6ICdtdXRhdGVkJywgZGF0YToge2VudGl0eTogZW50aXR5TmFtZSwgaXRlbXNJZHMsIG11dGF0aW9ufX0pXG4gICAgICAgIHJldHVybiBpdGVtc011dGF0aW9uc1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgREkudGhyb3dFcnJvcihgRU5USVRZOiAke2VudGl0eU5hbWV9IG11dGF0ZSgpYCwgZXJyb3IsIHtpdGVtc0lkcywgaXRlbXMsIG11dGF0aW9ufSlcbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jIHJlYWQgKHtpdGVtc0lkc30pIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICghaXRlbXNJZHMgfHwgIWl0ZW1zSWRzLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKGBFTlRJVFk6ICR7ZW50aXR5TmFtZX0gcmVhZChpdGVtc0lkcykgIHJlcXVpcmVkIGFyZ3NgKVxuICAgICAgICB2YXIgaXRlbXMgPSBhd2FpdCB2aWV3c1BhY2thZ2UuZ2V0KHtpZHM6IGl0ZW1zSWRzfSlcbiAgICAgICAgREkuZGVidWcoe21zZzogYEVOVElUWTogJHtlbnRpdHlOYW1lfSByZWFkKClgLCBjb250ZXh0OiBQQUNLQUdFLCBkZWJ1Zzoge2l0ZW1zSWRzLCBpdGVtc319KVxuICAgICAgICBESS5lbWl0RXZlbnQoe25hbWU6ICdyZWFkZWQnLCBkYXRhOiB7ZW50aXR5OiBlbnRpdHlOYW1lLCBpdGVtc0lkczogaXRlbXNJZHN9fSlcbiAgICAgICAgcmV0dXJuIGl0ZW1zXG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBESS50aHJvd0Vycm9yKGBFTlRJVFk6ICR7ZW50aXR5TmFtZX0gcmVhZCgpYCwgZXJyb3IsIHtpdGVtc0lkc30pXG4gICAgICB9XG4gICAgfSxcbiAgICBhc3luYyByZWZyZXNoVmlld3MgKHtpdGVtc0lkcywgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnN9KSB7XG4gICAgICB0cnkge1xuICAgICAgICBhd2FpdCB2aWV3c1BhY2thZ2UucmVmcmVzaEl0ZW1zVmlld3Moe2l0ZW1zSWRzLCBsb2FkU25hcHNob3QsIGxvYWRNdXRhdGlvbnMsIGFkZE11dGF0aW9uc30pXG4gICAgICAgIERJLmVtaXRFdmVudCh7bmFtZTogJ3ZpZXdzVXBkYXRlZCcsIGRhdGE6IHtlbnRpdHk6IGVudGl0eU5hbWUsIGl0ZW1zSWRzOiBpdGVtc0lkc319KVxuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgREkudGhyb3dFcnJvcihgRU5USVRZOiAke2VudGl0eU5hbWV9IHJlZnJlc2hWaWV3cygpYCwgZXJyb3IsIHtpdGVtc0lkcywgbG9hZFNuYXBzaG90LCBsb2FkTXV0YXRpb25zLCBhZGRNdXRhdGlvbnN9KVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19