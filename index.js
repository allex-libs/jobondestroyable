function createLib (execlib) {
  'use strict';
  var lib = execlib.lib;
  return lib.q(require('allex_jobondestroyablelowlevellib')(lib.inherit, lib.qlib.JobBase, lib.Error, lib.q.reject));
}

module.exports = createLib;
