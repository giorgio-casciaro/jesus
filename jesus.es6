const R = require('ramda')
// const jesus = require('jesus')
const uuidV4 = require('uuid/v4')
function setPackageArgsOverwrite () {
  var overwriteArgs = Array.prototype.slice.call(arguments, 1)
  var originalPackage = arguments[0]
  var modifiedPackage = {}
  for (var i in originalPackage) {
    modifiedPackage[i] = function packageArgsOverwrite () {
      var modifiedArguments = Object.assign(arguments, overwriteArgs)
      return originalPackage[i].apply(this, modifiedArguments)
    }
  }
  return modifiedPackage
}
function checkRequiredDependencies (DI, requiredDependenciesNames) {
  if (!DI) { throw new Error(`Required Dependencies Container is missing`) }
  requiredDependenciesNames.forEach((dependencyName) => {
    if (!DI[dependencyName]) {
      throw new Error(`Required Dependency ${dependencyName} is missing`)
    }
  })
}
function checkRequired (OBJ, propNames, PACKAGE = 'unknow') {
  if (!OBJ && propNames.length) { throw new Error(`PACKAGE ${PACKAGE} -> Required Dependencies Container is missing`) }
  propNames.forEach((propName) => {
    if (!OBJ[propName]) {
      throw new Error(`PACKAGE ${PACKAGE} -> Required Dependency ${propName} is missing`)
    }
  })
  return R.clone(OBJ)
}
function isEmptyArray (array) {
  return (!array || !array.length)
}
module.exports = {
  getValuePromise: function (value) {
    return new Promise((resolve, reject) => {
      Promise.resolve(value).then(function (value) {
        if (typeof (value) === 'function') {
          try { resolve(value()) } catch (error) { reject(error) }
        } else resolve(value)
      })
    })
  },
  checkRequired,
  checkRequiredDependencies,
  createNewIds: R.compose(R.map(() => uuidV4()), R.repeat(true)),
  // debug,
  addObjectColumn: function (objectsArray, columnName, valuesArray) {
    var addColums = (val, index) => R.merge({
      [columnName]: valuesArray[index]
    }, val)
    return R.addIndex(R.map)(addColums, objectsArray)
  },
  checkRequestItemsIdsAndItems ({itemsIds, items, generateIds = false, appendIdsToItems = false}) {
    console.log({itemsIds, items, generateIds, appendIdsToItems})
    if (isEmptyArray(items) && isEmptyArray(itemsIds)) throw new Error('ARG items or itemsIds is required')
    if (generateIds)itemsIds = R.map(() => uuidV4(), items)// generate ids
    if (isEmptyArray(itemsIds) && isEmptyArray(items) && !appendIdsToItems)itemsIds = R.map(R.prop('_id'), items)// get ids from items
    if (isEmptyArray(items))items = R.map(() => {}, itemsIds)// get items from ids
    if (itemsIds.length !== items.length) throw new Error('ARG itemsIds and items must have the same length')
    if (appendIdsToItems)items = R.addIndex(R.map)((item, index) => R.merge(item, {_id: itemsIds[index]}), items)// generate ids
    // items = R.map((item) => R.merge({'_id': uuidV4()}, item), items)// generate new ids in _id field
    return {itemsIds, items}
  }
  // getServiceErrorFunction: function (DI) {
  //   checkRequiredDependencies(DI, ['log'])
  //   return function serviceError (e) {
  //     DI.log('serviceError', e)
  //     throw new Error(e)
  //   }
  // }

}
