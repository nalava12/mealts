import { SchoolMenu } from './SchoolMenu';
import { SchoolSchedule } from './SchoolSchedule';
export declare class School {
    static readonly MONTHLY_MENU_URL = "sts_sci_md00_001.do";
    static readonly SCHEDULE_URL = "sts_sci_sf01_001.do";
    static readonly SCHOOL_CODE_URL = "spr_ccm_cm01_100.do";
    type: School.Type;
    region: School.Region;
    code: string;
    monthlyMenuCache: Map<number, SchoolMenu[]>;
    monthlyScheduleCache: Map<number, SchoolSchedule[]>;
    constructor(type: School.Type, region: School.Region, code: string);
    getMonthlyMenu(year: number, month: number): Promise<SchoolMenu[]>;
    getMonthlySchedule(year: number, month: number): Promise<SchoolSchedule[]>;
    private static getContentFromUrl;
    clearCache(): void;
    static find(region: School.Region, name: string): Promise<School>;
}
export declare namespace School {
    enum Type {
        KINDERGARTEN = "1",
        ELEMENTARY = "2",
        MIDDLE = "3",
        HIGH = "4"
    }
    enum Region {
        SEOUL = "sen.go.kr",
        INCHEON = "ice.go.kr",
        BUSAN = "pen.go.kr",
        GWANGJU = "gen.go.kr",
        DAEJEON = "dje.go.kr",
        DAEGU = "dge.go.kr",
        SEJONG = "sje.go.kr",
        ULSAN = "use.go.kr",
        GYEONGGI = "goe.go.kr",
        KANGWON = "kwe.go.kr",
        CHUNGBUK = "cbe.go.kr",
        CHUNGNAM = "cne.go.kr",
        GYEONGBUK = "gbe.go.kr",
        GYEONGNAM = "gne.go.kr",
        JEONBUK = "jbe.go.kr",
        JEONNAM = "jne.go.kr",
        JEJU = "jje.go.kr"
    }
}
