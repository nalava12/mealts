"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchoolSchedule_1 = require("./SchoolSchedule");
const Utils_1 = require("./Utils");
var SchoolScheduleParser;
(function (SchoolScheduleParser) {
    let schedulePattern = /\<strong\>\<\/strong\>/;
    function parse(rawData) {
        if (rawData.length < 1)
            throw new Error('불러온 데이터가 올바르지 않습니다.');
        let monthlySchedule = [];
        rawData = rawData.replace(/\s+/g, "");
        let chunk = rawData.split("textL\">");
        try {
            for (let i = 1; i < chunk.length; i++) {
                let trimmed = Utils_1.Utils.before(chunk[i], "</div>");
                let date = Utils_1.Utils.before(Utils_1.Utils.after(trimmed, ">"), "</em>");
                if (date.length < 1)
                    continue;
                let schedule = [];
                while (trimmed.includes("<strong>")) {
                    let name = Utils_1.Utils.before(Utils_1.Utils.after(trimmed, "<strong>"), "</strong>");
                    schedule.push(name);
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
