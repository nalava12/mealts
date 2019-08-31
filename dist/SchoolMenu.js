"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var he_1 = require("he");
var SchoolMenu = /** @class */ (function () {
    function SchoolMenu() {
        this._breakfast = this._lunch = this._dinner = "급식이 없습니다";
    }
    Object.defineProperty(SchoolMenu.prototype, "breakfast", {
        get: function () {
            return this._breakfast;
        },
        set: function (str) {
            this._breakfast = he_1.decode(str);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchoolMenu.prototype, "lunch", {
        get: function () {
            return this._lunch;
        },
        set: function (str) {
            this._lunch = he_1.decode(str);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SchoolMenu.prototype, "dinner", {
        get: function () {
            return this._dinner;
        },
        set: function (str) {
            this._dinner = he_1.decode(str);
        },
        enumerable: true,
        configurable: true
    });
    SchoolMenu.prototype.toString = function () {
        return "[\uC544\uCE68]\n" + this.breakfast + "\n[\uC810\uC2EC]\n" + this.lunch + "\n[\uC800\uB141]\n" + this.dinner;
    };
    return SchoolMenu;
}());
exports.SchoolMenu = SchoolMenu;
