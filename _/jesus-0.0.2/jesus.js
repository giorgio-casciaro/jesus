'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var R = require('ramda');
// const jesus = require('jesus')
var uuidV4 = require('uuid/v4');
function setPackageArgsOverwrite() {
  var overwriteArgs = Array.prototype.slice.call(arguments, 1);
  var originalPackage = arguments[0];
  var modifiedPackage = {};
  for (var i in originalPackage) {
    modifiedPackage[i] = function packageArgsOverwrite() {
      var modifiedArguments = Object.assign(arguments, overwriteArgs);
      return originalPackage[i].apply(this, modifiedArguments);
    };
  }
  return modifiedPackage;
}
function checkRequiredDependencies(DI, requiredDependenciesNames) {
  if (!DI) {
    throw new Error('Required Dependencies Container is missing');
  }
  requiredDependenciesNames.forEach(function (dependencyName) {
    if (!DI[dependencyName]) {
      throw new Error('Required Dependency ' + dependencyName + ' is missing');
    }
  });
}
function checkRequired(OBJ, propNames) {
  var PACKAGE = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'unknow';

  if (!OBJ && propNames.length) {
    throw new Error('PACKAGE ' + PACKAGE + ' -> Required Dependencies Container is missing');
  }
  propNames.forEach(function (propName) {
    if (!OBJ[propName]) {
      throw new Error('PACKAGE ' + PACKAGE + ' -> Required Dependency ' + propName + ' is missing');
    }
  });
  return R.clone(OBJ);
}
function isEmptyArray(array) {
  return !array || !array.length;
}
module.exports = {
  getValuePromise: function getValuePromise(value) {
    return new Promise(function (resolve, reject) {
      Promise.resolve(value).then(function (value) {
        if (typeof value === 'function') {
          try {
            resolve(value());
          } catch (error) {
            reject(error);
          }
        } else resolve(value);
      });
    });
  },
  checkRequired: checkRequired,
  checkRequiredDependencies: checkRequiredDependencies,
  createNewIds: R.compose(R.map(function () {
    return uuidV4();
  }), R.repeat(true)),
  // debug,
  addObjectColumn: function addObjectColumn(objectsArray, columnName, valuesArray) {
    var addColums = function addColums(val, index) {
      return R.merge(_defineProperty({}, columnName, valuesArray[index]), val);
    };
    return R.addIndex(R.map)(addColums, objectsArray);
  },
  checkRequestItemsIdsAndItems: function checkRequestItemsIdsAndItems(_ref) {
    var itemsIds = _ref.itemsIds,
        items = _ref.items,
        _ref$generateIds = _ref.generateIds,
        generateIds = _ref$generateIds === undefined ? false : _ref$generateIds,
        _ref$appendIdsToItems = _ref.appendIdsToItems,
        appendIdsToItems = _ref$appendIdsToItems === undefined ? false : _ref$appendIdsToItems;

    console.log({ itemsIds: itemsIds, items: items, generateIds: generateIds, appendIdsToItems: appendIdsToItems });
    if (isEmptyArray(items) && isEmptyArray(itemsIds)) throw new Error('ARG items or itemsIds is required');
    if (generateIds) itemsIds = R.map(function () {
      return uuidV4();
    }, items); // generate ids
    if (isEmptyArray(itemsIds) && isEmptyArray(items) && !appendIdsToItems) itemsIds = R.map(R.prop('_id'), items); // get ids from items
    if (isEmptyArray(items)) items = R.map(function () {}, itemsIds); // get items from ids
    if (itemsIds.length !== items.length) throw new Error('ARG itemsIds and items must have the same length');
    if (appendIdsToItems) items = R.addIndex(R.map)(function (item, index) {
      return R.merge(item, { _id: itemsIds[index] });
    }, items); // generate ids
    // items = R.map((item) => R.merge({'_id': uuidV4()}, item), items)// generate new ids in _id field
    return { itemsIds: itemsIds, items: items };
  }
  // getServiceErrorFunction: function (DI) {
  //   checkRequiredDependencies(DI, ['log'])
  //   return function serviceError (e) {
  //     DI.log('serviceError', e)
  //     throw new Error(e)
  //   }
  // }

};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImplc3VzLmVzNiJdLCJuYW1lcyI6WyJSIiwicmVxdWlyZSIsInV1aWRWNCIsInNldFBhY2thZ2VBcmdzT3ZlcndyaXRlIiwib3ZlcndyaXRlQXJncyIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwib3JpZ2luYWxQYWNrYWdlIiwibW9kaWZpZWRQYWNrYWdlIiwiaSIsInBhY2thZ2VBcmdzT3ZlcndyaXRlIiwibW9kaWZpZWRBcmd1bWVudHMiLCJPYmplY3QiLCJhc3NpZ24iLCJhcHBseSIsImNoZWNrUmVxdWlyZWREZXBlbmRlbmNpZXMiLCJESSIsInJlcXVpcmVkRGVwZW5kZW5jaWVzTmFtZXMiLCJFcnJvciIsImZvckVhY2giLCJkZXBlbmRlbmN5TmFtZSIsImNoZWNrUmVxdWlyZWQiLCJPQkoiLCJwcm9wTmFtZXMiLCJQQUNLQUdFIiwibGVuZ3RoIiwicHJvcE5hbWUiLCJjbG9uZSIsImlzRW1wdHlBcnJheSIsImFycmF5IiwibW9kdWxlIiwiZXhwb3J0cyIsImdldFZhbHVlUHJvbWlzZSIsInZhbHVlIiwiUHJvbWlzZSIsInJlc29sdmUiLCJyZWplY3QiLCJ0aGVuIiwiZXJyb3IiLCJjcmVhdGVOZXdJZHMiLCJjb21wb3NlIiwibWFwIiwicmVwZWF0IiwiYWRkT2JqZWN0Q29sdW1uIiwib2JqZWN0c0FycmF5IiwiY29sdW1uTmFtZSIsInZhbHVlc0FycmF5IiwiYWRkQ29sdW1zIiwidmFsIiwiaW5kZXgiLCJtZXJnZSIsImFkZEluZGV4IiwiY2hlY2tSZXF1ZXN0SXRlbXNJZHNBbmRJdGVtcyIsIml0ZW1zSWRzIiwiaXRlbXMiLCJnZW5lcmF0ZUlkcyIsImFwcGVuZElkc1RvSXRlbXMiLCJjb25zb2xlIiwibG9nIiwicHJvcCIsIml0ZW0iLCJfaWQiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFNQSxJQUFJQyxRQUFRLE9BQVIsQ0FBVjtBQUNBO0FBQ0EsSUFBTUMsU0FBU0QsUUFBUSxTQUFSLENBQWY7QUFD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QU0sSUFBSVAsS0FBSixDQUFVLGtEQUFWLENBQU47QUFDdEMsUUFBSXNDLGdCQUFKLEVBQXFCRixRQUFRekQsRUFBRXNELFFBQUYsQ0FBV3RELEVBQUU0QyxHQUFiLEVBQWtCLFVBQUNtQixJQUFELEVBQU9YLEtBQVA7QUFBQSxhQUFpQnBELEVBQUVxRCxLQUFGLENBQVFVLElBQVIsRUFBYyxFQUFDQyxLQUFLUixTQUFTSixLQUFULENBQU4sRUFBZCxDQUFqQjtBQUFBLEtBQWxCLEVBQTBFSyxLQUExRSxDQUFSLENBUHlFLENBT2U7QUFDN0c7QUFDQSxXQUFPLEVBQUNELGtCQUFELEVBQVdDLFlBQVgsRUFBUDtBQUNEO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBckNlLENBQWpCIiwiZmlsZSI6Implc3VzLmVzNiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IFIgPSByZXF1aXJlKCdyYW1kYScpXG4vLyBjb25zdCBqZXN1cyA9IHJlcXVpcmUoJ2plc3VzJylcbmNvbnN0IHV1aWRWNCA9IHJlcXVpcmUoJ3V1aWQvdjQnKVxuZnVuY3Rpb24gc2V0UGFja2FnZUFyZ3NPdmVyd3JpdGUgKCkge1xuICB2YXIgb3ZlcndyaXRlQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSlcbiAgdmFyIG9yaWdpbmFsUGFja2FnZSA9IGFyZ3VtZW50c1swXVxuICB2YXIgbW9kaWZpZWRQYWNrYWdlID0ge31cbiAgZm9yICh2YXIgaSBpbiBvcmlnaW5hbFBhY2thZ2UpIHtcbiAgICBtb2RpZmllZFBhY2thZ2VbaV0gPSBmdW5jdGlvbiBwYWNrYWdlQXJnc092ZXJ3cml0ZSAoKSB7XG4gICAgICB2YXIgbW9kaWZpZWRBcmd1bWVudHMgPSBPYmplY3QuYXNzaWduKGFyZ3VtZW50cywgb3ZlcndyaXRlQXJncylcbiAgICAgIHJldHVybiBvcmlnaW5hbFBhY2thZ2VbaV0uYXBwbHkodGhpcywgbW9kaWZpZWRBcmd1bWVudHMpXG4gICAgfVxuICB9XG4gIHJldHVybiBtb2RpZmllZFBhY2thZ2Vcbn1cbmZ1bmN0aW9uIGNoZWNrUmVxdWlyZWREZXBlbmRlbmNpZXMgKERJLCByZXF1aXJlZERlcGVuZGVuY2llc05hbWVzKSB7XG4gIGlmICghREkpIHsgdGhyb3cgbmV3IEVycm9yKGBSZXF1aXJlZCBEZXBlbmRlbmNpZXMgQ29udGFpbmVyIGlzIG1pc3NpbmdgKSB9XG4gIHJlcXVpcmVkRGVwZW5kZW5jaWVzTmFtZXMuZm9yRWFjaCgoZGVwZW5kZW5jeU5hbWUpID0+IHtcbiAgICBpZiAoIURJW2RlcGVuZGVuY3lOYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBSZXF1aXJlZCBEZXBlbmRlbmN5ICR7ZGVwZW5kZW5jeU5hbWV9IGlzIG1pc3NpbmdgKVxuICAgIH1cbiAgfSlcbn1cbmZ1bmN0aW9uIGNoZWNrUmVxdWlyZWQgKE9CSiwgcHJvcE5hbWVzLCBQQUNLQUdFID0gJ3Vua25vdycpIHtcbiAgaWYgKCFPQkogJiYgcHJvcE5hbWVzLmxlbmd0aCkgeyB0aHJvdyBuZXcgRXJyb3IoYFBBQ0tBR0UgJHtQQUNLQUdFfSAtPiBSZXF1aXJlZCBEZXBlbmRlbmNpZXMgQ29udGFpbmVyIGlzIG1pc3NpbmdgKSB9XG4gIHByb3BOYW1lcy5mb3JFYWNoKChwcm9wTmFtZSkgPT4ge1xuICAgIGlmICghT0JKW3Byb3BOYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQQUNLQUdFICR7UEFDS0FHRX0gLT4gUmVxdWlyZWQgRGVwZW5kZW5jeSAke3Byb3BOYW1lfSBpcyBtaXNzaW5nYClcbiAgICB9XG4gIH0pXG4gIHJldHVybiBSLmNsb25lKE9CSilcbn1cbmZ1bmN0aW9uIGlzRW1wdHlBcnJheSAoYXJyYXkpIHtcbiAgcmV0dXJuICghYXJyYXkgfHwgIWFycmF5Lmxlbmd0aClcbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRWYWx1ZVByb21pc2U6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBQcm9taXNlLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgKHZhbHVlKSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRyeSB7IHJlc29sdmUodmFsdWUoKSkgfSBjYXRjaCAoZXJyb3IpIHsgcmVqZWN0KGVycm9yKSB9XG4gICAgICAgIH0gZWxzZSByZXNvbHZlKHZhbHVlKVxuICAgICAgfSlcbiAgICB9KVxuICB9LFxuICBjaGVja1JlcXVpcmVkLFxuICBjaGVja1JlcXVpcmVkRGVwZW5kZW5jaWVzLFxuICBjcmVhdGVOZXdJZHM6IFIuY29tcG9zZShSLm1hcCgoKSA9PiB1dWlkVjQoKSksIFIucmVwZWF0KHRydWUpKSxcbiAgLy8gZGVidWcsXG4gIGFkZE9iamVjdENvbHVtbjogZnVuY3Rpb24gKG9iamVjdHNBcnJheSwgY29sdW1uTmFtZSwgdmFsdWVzQXJyYXkpIHtcbiAgICB2YXIgYWRkQ29sdW1zID0gKHZhbCwgaW5kZXgpID0+IFIubWVyZ2Uoe1xuICAgICAgW2NvbHVtbk5hbWVdOiB2YWx1ZXNBcnJheVtpbmRleF1cbiAgICB9LCB2YWwpXG4gICAgcmV0dXJuIFIuYWRkSW5kZXgoUi5tYXApKGFkZENvbHVtcywgb2JqZWN0c0FycmF5KVxuICB9LFxuICBjaGVja1JlcXVlc3RJdGVtc0lkc0FuZEl0ZW1zICh7aXRlbXNJZHMsIGl0ZW1zLCBnZW5lcmF0ZUlkcyA9IGZhbHNlLCBhcHBlbmRJZHNUb0l0ZW1zID0gZmFsc2V9KSB7XG4gICAgY29uc29sZS5sb2coe2l0ZW1zSWRzLCBpdGVtcywgZ2VuZXJhdGVJZHMsIGFwcGVuZElkc1RvSXRlbXN9KVxuICAgIGlmIChpc0VtcHR5QXJyYXkoaXRlbXMpICYmIGlzRW1wdHlBcnJheShpdGVtc0lkcykpIHRocm93IG5ldyBFcnJvcignQVJHIGl0ZW1zIG9yIGl0ZW1zSWRzIGlzIHJlcXVpcmVkJylcbiAgICBpZiAoZ2VuZXJhdGVJZHMpaXRlbXNJZHMgPSBSLm1hcCgoKSA9PiB1dWlkVjQoKSwgaXRlbXMpLy8gZ2VuZXJhdGUgaWRzXG4gICAgaWYgKGlzRW1wdHlBcnJheShpdGVtc0lkcykgJiYgaXNFbXB0eUFycmF5KGl0ZW1zKSAmJiAhYXBwZW5kSWRzVG9JdGVtcylpdGVtc0lkcyA9IFIubWFwKFIucHJvcCgnX2lkJyksIGl0ZW1zKS8vIGdldCBpZHMgZnJvbSBpdGVtc1xuICAgIGlmIChpc0VtcHR5QXJyYXkoaXRlbXMpKWl0ZW1zID0gUi5tYXAoKCkgPT4ge30sIGl0ZW1zSWRzKS8vIGdldCBpdGVtcyBmcm9tIGlkc1xuICAgIGlmIChpdGVtc0lkcy5sZW5ndGggIT09IGl0ZW1zLmxlbmd0aCkgdGhyb3cgbmV3IEVycm9yKCdBUkcgaXRlbXNJZHMgYW5kIGl0ZW1zIG11c3QgaGF2ZSB0aGUgc2FtZSBsZW5ndGgnKVxuICAgIGlmIChhcHBlbmRJZHNUb0l0ZW1zKWl0ZW1zID0gUi5hZGRJbmRleChSLm1hcCkoKGl0ZW0sIGluZGV4KSA9PiBSLm1lcmdlKGl0ZW0sIHtfaWQ6IGl0ZW1zSWRzW2luZGV4XX0pLCBpdGVtcykvLyBnZW5lcmF0ZSBpZHNcbiAgICAvLyBpdGVtcyA9IFIubWFwKChpdGVtKSA9PiBSLm1lcmdlKHsnX2lkJzogdXVpZFY0KCl9LCBpdGVtKSwgaXRlbXMpLy8gZ2VuZXJhdGUgbmV3IGlkcyBpbiBfaWQgZmllbGRcbiAgICByZXR1cm4ge2l0ZW1zSWRzLCBpdGVtc31cbiAgfVxuICAvLyBnZXRTZXJ2aWNlRXJyb3JGdW5jdGlvbjogZnVuY3Rpb24gKERJKSB7XG4gIC8vICAgY2hlY2tSZXF1aXJlZERlcGVuZGVuY2llcyhESSwgWydsb2cnXSlcbiAgLy8gICByZXR1cm4gZnVuY3Rpb24gc2VydmljZUVycm9yIChlKSB7XG4gIC8vICAgICBESS5sb2coJ3NlcnZpY2VFcnJvcicsIGUpXG4gIC8vICAgICB0aHJvdyBuZXcgRXJyb3IoZSlcbiAgLy8gICB9XG4gIC8vIH1cblxufVxuIl19