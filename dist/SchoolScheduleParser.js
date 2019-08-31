"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SchoolSchedule_1 = require("./SchoolSchedule");
var Utils_1 = require("./Utils");
var SchoolScheduleParser;
(function (SchoolScheduleParser) {
    var schedulePattern = /\<strong\>\<\/strong\>/;
    function parse(rawData) {
        if (rawData.length < 1)
            throw new Error('불러온 데이터가 올바르지 않습니다.');
        var monthlySchedule = [];
        rawData = rawData.replace(/\s+/g, "");
        var chunk = rawData.split("textL\">");
        try {
            for (var i = 1; i < chunk.length; i++) {
                var trimmed = Utils_1.Utils.before(chunk[i], "</div>");
                var date = Utils_1.Utils.before(Utils_1.Utils.after(trimmed, ">"), "</em>");
                if (date.length < 1)
                    continue;
                var schedule = [];
                while (trimmed.includes("<strong>")) {
                    var name_1 = Utils_1.Utils.before(Utils_1.Utils.after(trimmed, "<strong>"), "</strong>");
                    schedule.push(name_1);
                    schedule.push("\n");
                    trimmed = Utils_1.Utils.after(trimmed, "</strong>");
                }
                monthlySchedule.push(new SchoolSchedule_1.SchoolSchedule(schedule.join()));
            }
            return monthlySchedule;
        }
        catch (e) {
            throw new Error("학사일정 정보 파싱에 실패했습니다. API를 최신 버전으로 업데이트 해 주세요.");
        }
    }
    SchoolScheduleParser.parse = parse;
})(SchoolScheduleParser = exports.SchoolScheduleParser || (exports.SchoolScheduleParser = {}));
