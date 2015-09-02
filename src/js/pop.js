define(["exports", "module", "./modules/foo", "./modules/bar"], function (exports, module, _modulesFoo, _modulesBar) {
  "use strict";

  var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

  var foo = _interopRequire(_modulesFoo);

  var bar = _interopRequire(_modulesBar);

  var init = function () {
    console.log("From module foo >>> ", foo);
    console.log("From module bar >>> ", bar);
  };

  module.exports = init;
});