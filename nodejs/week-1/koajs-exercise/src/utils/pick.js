// pick function from https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore

/**
 * Picks the specified keys from an object.
 * @param {*} object - The source object.
 * @param {*} keys - The keys array to pick from the object.
 * @returns {*} - A new object with the picked keys.
 */
function pick(object, keys) {
  return keys.reduce((obj, key) => {
    if (object && object.hasOwnProperty(key)) {
      obj[key] = object[key];
    }
    return obj;
  }, {});
}

module.exports = pick;
