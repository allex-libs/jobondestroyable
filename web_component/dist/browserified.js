(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
ALLEX.execSuite.libRegistry.register('allex_jobondestroyablelib',require('./index')(ALLEX));

},{"./index":2}],2:[function(require,module,exports){
function createLib (execlib) {
  'use strict';
  var lib = execlib.lib;
  return require('allex_jobondestroyablelowlevellib')(lib.inherit, lib.qlib.JobBase, lib.Error, lib.q.reject);
}

module.exports = createLib;

},{"allex_jobondestroyablelowlevellib":3}],3:[function(require,module,exports){
function createJobOnDestroyable (inherit, JobBase, Error, qreject) {
  'use strict';
  function JobOnDestroyableBase (destroyable, defer) {
    JobBase.call(this, defer);
    this.destroyable = destroyable;
  }
  inherit(JobOnDestroyableBase, JobBase);
  JobOnDestroyableBase.prototype.destroy = function () {
    this.destroyable = null;
    JobBase.prototype.destroy.call(this);
  };
  JobOnDestroyableBase.prototype.okToGo = function () {
    var ret = {ok: true, val: null};
    if (!this.defer) {
      ret.ok = false;
      ret.val = qreject(new Error('ALREADY_DESTROYED'));
      return ret;
    }
    ret.val = this.defer.promise;
    if (!this.okToProceed()) {
      ret.ok = false;
    }
    return ret;
  };
  JobOnDestroyableBase.prototype.peekToProceed = function () {
    var ret = {ok: true, val: null};
    if (!(this.destroyable && this.defer)) {
      ret.ok = false;
      ret.val = new Error('ALREADY_DESTROYED');
      return ret;
    }
    if (!this._destroyableOk()) {
      ret.ok = false;
      ret.val = new Error('DESTROYABLE_REFERENCE_DESTROYED');
      return ret;
    }
    ret.val = this.defer.promise;
    return ret;
  };
  JobOnDestroyableBase.prototype.okToProceed = function () {
    var ptp = this.peekToProceed();
    if (!ptp.ok) {
      this.reject(ptp.val);
    }
    return ptp.ok;
  };

  function JobOnDestroyable (destroyable, defer) {
    JobOnDestroyableBase.call(this, destroyable, defer);
  }
  inherit(JobOnDestroyable, JobOnDestroyableBase);
  JobOnDestroyable.prototype._destroyableOk = function () {
    return this.destroyable && this.destroyable.destroyed;
  };

  function JobOnComplexDestroyable (destroyable, defer) {
    JobOnDestroyableBase.call(this, destroyable, defer);
  }
  inherit(JobOnComplexDestroyable, JobOnDestroyableBase);
  JobOnComplexDestroyable.prototype._destroyableOk = function () {
    return this.destroyable && this.destroyable.aboutToDie;
  };

  return {
    JobOnDestroyableBase: JobOnDestroyableBase,
    JobOnDestroyable: JobOnDestroyable,
    JobOnComplexDestroyable: JobOnComplexDestroyable
  };
}

module.exports = createJobOnDestroyable;

},{}]},{},[1]);
