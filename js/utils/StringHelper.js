/**
 * Created by sshao on 6/2/2016.
 */
"use strict";

/**
 * StringHelper provides string.format functionality.
 * Starts with the last {i} and works to {0}.
 *
 * @class StringHelper
 *
 */
String.prototype.format = function () { // eslint-disable-line no-extend-native
  var args = Array.prototype.slice.call(arguments);
  var transformation = null;
  if (typeof args[0] === 'function') {
    transformation = args.shift();
  }
  var s = this, i = args.length;
  while (i--) {
    var arg = args[i];
    if (transformation) {
      arg = transformation(arg);
    }
    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arg);
  }
  return s;
};

var StringHelper = {
  isUndefinedOrNullOrEmpty: (val) => {
    return val === undefined || val === null || ((typeof(val) === 'string') && (val.trim() === ''));
  }
};

module.exports = StringHelper;
