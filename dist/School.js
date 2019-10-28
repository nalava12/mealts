"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const SchoolMenuParser_1 = require("./SchoolMenuParser");
const SchoolScheduleParser_1 = require("./SchoolScheduleParser");
const Utils_1 = require("./Utils");
class School {
    constructor(type, region, code) {
        this.type = type;
        this.region = region;
        this.code = code;
        this.monthlyMenuCache = new Map();
        this.monthlyScheduleCache = new Map();
    }
    getMonthlyMenu(year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            let cacheKey = year * 12 + month;
            if (this.monthlyMenuCache.has(cacheKey))
                return this.monthlyMenuCache.get(cacheKey) || [];
            let targetUrl = `https://stu.${this.region}/${School.MONTHLY_MENU_URL}`;
            targetUrl += `?schulCode=${this.code}`;
            targetUrl += `&schulCrseScCode=${this.type}`;
            targetUrl += `&schulKndScCode=0${this.type}`;
            targetUrl += `&schYm=${year}${month.toString().padStart(2, '0')}`;
            targetUrl += '&';
            return new Promise((resolve, reject) => {
                try {
                    School.getContentFromUrl(targetUrl).then(content => {
                        content = Utils_1.Utils.before(Utils_1.Utils.after(content, "<tbody>"), "</tbody>");
                        let monthlyMenu = SchoolMenuParser_1.SchoolMenuParser.parse(content);
                        this.monthlyMenuCache.set(cacheKey, monthlyMenu);
                        resolve(monthlyMenu);
                    }).catch(reject);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    getMonthlySchedule(year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            let cacheKey = year * 12 + month;
            if (this.monthlyScheduleCache.has(cacheKey))
                return this.monthlyScheduleCache.get(cacheKey) || [];
            let targetUrl = `https://stu.${this.region}/${School.SCHEDULE_URL}`;
            targetUrl += `?schulCode=${this.code}`;
            targetUrl += `&schulCrseScCode=${this.type}`;
            targetUrl += `&schulKndScCode=0${this.type}`;
            targetUrl += `&ay=${year}`;
            targetUrl += `&mm=${month.toString().padStart(2, '0')}`;
            targetUrl += '&';
            return new Promise((resolve, reject) => {
                try {
                    School.getContentFromUrl(targetUrl).then(content => {
                        content = Utils_1.Utils.before(Utils_1.Utils.after(content, "<tbody>"), "</tbody>");
                        let monthlySchedule = SchoolScheduleParser_1.SchoolScheduleParser.parse(content);
                        this.monthlyScheduleCache.set(cacheKey, monthlySchedule);
                        resolve(monthlySchedule);
                    }).catch(reject);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
    static getContentFromUrl(url) {
        return new Promise((resolve, reject) => {
            https_1.default.get(url, res => {
                let resData = '';
                res.on('data', chunk => {
                    resData += chunk;
                });
                res.on('end', () => {
                    resolve(resData);
                });
                res.on('error', reject);
            });
        });
    }
    clearCache() {
        this.monthlyMenuCache.clear();
        this.monthlyScheduleCache.clear();
    }
    static find(region, name) {
        return __awaiter(this, void 0, void 0, function* () {
            let targetUrl = `https://par.${region}/${School.SCHOOL_CODE_URL}`;
            targetUrl += `?kraOrgNm=${encodeURIComponent(name)}`;
            targetUrl += '&';
            return new Promise((resolve, reject) => {
                try {
                    School.getContentFromUrl(targetUrl).then(content => {
                        content = Utils_1.Utils.before(Utils_1.Utils.after(content, "orgCode"), "schulCrseScCodeNm");
                        let schoolCode = content.substring(3, 13);
                        let schoolType = Utils_1.Utils.before(Utils_1.Utils.after(content, 'schulCrseScCode\":\"'), '\"');
                        let enumSchoolType = schoolType;
                        resolve(new School(enumSchoolType, region, schoolCode));
                    }).catch(reject);
                }
                catch (e) {
                    reject(e);
                }
            });
        });
    }
}
exports.School = School;
School.MONTHLY_MENU_URL = "sts_sci_md00_001.do";
School.SCHEDULE_URL = "sts_sci_sf01_001.do";
School.SCHOOL_CODE_URL = "spr_ccm_cm01_100.do";
(function (School) {
    let Type;
    (function (Type) {
        Type["KINDERGARTEN"] = "1";
        Type["ELEMENTARY"] = "2";
        Type["MIDDLE"] = "3";
        Type["HIGH"] = "4";
    })(Type = School.Type || (School.Type = {}));
    let Region;
    (function (Region) {
        Region["SEOUL"] = "sen.go.kr";
        Region["INCHEON"] = "ice.go.kr";
        Region["BUSAN"] = "pen.go.kr";
        Region["GWANGJU"] = "gen.go.kr";
        Region["DAEJEON"] = "dje.go.kr";
        Region["DAEGU"] = "dge.go.kr";
        Region["SEJONG"] = "sje.go.kr";
        Region["ULSAN"] = "use.go.kr";
        Region["GYEONGGI"] = "goe.go.kr";
        Region["KANGWON"] = "kwe.go.kr";
        Region["CHUNGBUK"] = "cbe.go.kr";
        Region["CHUNGNAM"] = "cne.go.kr";
        Region["GYEONGBUK"] = "gbe.go.kr";
        Region["GYEONGNAM"] = "gne.go.kr";
        Region["JEONBUK"] = "jbe.go.kr";
        Region["JEONNAM"] = "jne.go.kr";
        Region["JEJU"] = "jje.go.kr";
    })(Region = School.Region || (School.Region = {}));
})(School = exports.School || (exports.School = {}));
