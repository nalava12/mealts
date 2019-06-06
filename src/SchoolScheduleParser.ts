import { SchoolSchedule } from './SchoolSchedule'
import { Utils } from './Utils'

export namespace SchoolScheduleParser {
  let schedulePattern = /\<strong\>\<\/strong\>/

  export function parse(rawData: string): SchoolSchedule[] {
    if(rawData.length < 1)
      throw new Error('불러온 데이터가 올바르지 않습니다.');

      let monthlySchedule: SchoolSchedule[] = [];
    
      rawData = rawData.replace(/\s+/g, "");

      let chunk = rawData.split("textL\">");

      try {
        for (let i = 1; i < chunk.length; i++) {
          let trimmed = Utils.before(chunk[i], "</div>")
          let date = Utils.before(Utils.after(trimmed, ">"), "</em>");

          if (date.length < 1) continue;

          let schedule: string[] = []
          while(trimmed.includes("<strong>")) {
            let name = Utils.before(Utils.after(trimmed, "<strong>"), "</strong>");
            schedule.push(name);
            schedule.push("\n");
            trimmed = Utils.after(trimmed, "</strong>");
          }
          monthlySchedule.push(new SchoolSchedule(schedule.join()))
        }
        return monthlySchedule
      } catch (e) {
        throw new Error("학사일정 정보 파싱에 실패했습니다. API를 최신 버전으로 업데이트 해 주세요.");
      }
  }
}