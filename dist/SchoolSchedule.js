"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SchoolSchedule = /** @class */ (function () {
    function SchoolSchedule(schedule) {
        this.schedule = schedule || "";
    }
    SchoolSchedule.prototype.toString = function () {
        return this.schedule;
    };
    return SchoolSchedule;
}());
exports.SchoolSchedule = SchoolSchedule;
