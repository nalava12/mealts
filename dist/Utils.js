"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Utils;
(function (Utils) {
    function before(string, delimiter) {
        let index = string.indexOf(delimiter);
        return string.substring(0, index);
    }
    Utils.before = before;
    function after(string, delimiter) {
        let index = string.indexOf(delimiter);
        return string.substring(index + delimiter.length);
    }
    Utils.after = after;
})(Utils = exports.Utils || (exports.Utils = {}));
