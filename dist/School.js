"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var https_1 = __importDefault(require("https"));
var SchoolMenuParser_1 = require("./SchoolMenuParser");
var SchoolScheduleParser_1 = require("./SchoolScheduleParser");
var Utils_1 = require("./Utils");
var School = /** @class */ (function () {
    function School(type, region, code) {
        this.type = type;
        this.region = region;
        this.code = code;
        this.monthlyMenuCache = new Map();
        this.monthlyScheduleCache = new Map();
    }
    School.prototype.getMonthlyMenu = function (year, month) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, targetUrl;
            var _this = this;
            return __generator(this, function (_a) {
                cacheKey = year * 12 + month;
                if (this.monthlyMenuCache.has(cacheKey))
                    return [2 /*return*/, this.monthlyMenuCache.get(cacheKey) || []];
                targetUrl = "https://stu." + this.region + "/" + School.MONTHLY_MENU_URL;
                targetUrl += "?schulCode=" + this.code;
                targetUrl += "&schulCrseScCode=" + this.type;
                targetUrl += "&schulKndScCode=0" + this.type;
                targetUrl += "&schYm=" + year + month.toString().padStart(2, '0');
                targetUrl += '&';
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            School.getContentFromUrl(new URL(targetUrl)).then(function (content) {
                                content = Utils_1.Utils.before(Utils_1.Utils.after(content, "<tbody>"), "</tbody>");
                                var monthlyMenu = SchoolMenuParser_1.SchoolMenuParser.parse(content);
                                _this.monthlyMenuCache.set(cacheKey, monthlyMenu);
                                resolve(monthlyMenu);
                            }).catch(reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    })];
            });
        });
    };
    School.prototype.getMonthlySchedule = function (year, month) {
        return __awaiter(this, void 0, void 0, function () {
            var cacheKey, targetUrl;
            var _this = this;
            return __generator(this, function (_a) {
                cacheKey = year * 12 + month;
                if (this.monthlyScheduleCache.has(cacheKey))
                    return [2 /*return*/, this.monthlyScheduleCache.get(cacheKey) || []];
                targetUrl = "https://stu." + this.region + "/" + School.SCHEDULE_URL;
                targetUrl += "?schulCode=" + this.code;
                targetUrl += "&schulCrseScCode=" + this.type;
                targetUrl += "&schulKndScCode=0" + this.type;
                targetUrl += "&ay=" + year;
                targetUrl += "&mm=" + month.toString().padStart(2, '0');
                targetUrl += '&';
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            School.getContentFromUrl(new URL(targetUrl)).then(function (content) {
                                content = Utils_1.Utils.before(Utils_1.Utils.after(content, "<tbody>"), "</tbody>");
                                var monthlySchedule = SchoolScheduleParser_1.SchoolScheduleParser.parse(content);
                                _this.monthlyScheduleCache.set(cacheKey, monthlySchedule);
                                resolve(monthlySchedule);
                            }).catch(reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    })];
            });
        });
    };
    School.getContentFromUrl = function (url) {
        return new Promise(function (resolve, reject) {
            https_1.default.get(url, function (res) {
                var resData = '';
                res.on('data', function (chunk) {
                    resData += chunk;
                });
                res.on('end', function () {
                    resolve(resData);
                });
                res.on('error', reject);
            });
        });
    };
    School.prototype.clearCache = function () {
        this.monthlyMenuCache.clear();
        this.monthlyScheduleCache.clear();
    };
    School.find = function (region, name) {
        return __awaiter(this, void 0, void 0, function () {
            var targetUrl;
            return __generator(this, function (_a) {
                targetUrl = "https://par." + region + "/" + School.SCHOOL_CODE_URL;
                targetUrl += "?kraOrgNm=" + encodeURIComponent(name);
                targetUrl += '&';
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        try {
                            School.getContentFromUrl(new URL(targetUrl)).then(function (content) {
                                content = Utils_1.Utils.before(Utils_1.Utils.after(content, "orgCode"), "schulCrseScCodeNm");
                                var schoolCode = content.substring(3, 13);
                                var schoolType = Utils_1.Utils.before(Utils_1.Utils.after(content, 'schulCrseScCode\":\"'), '\"');
                                var enumSchoolType = School.Type[Object.keys(School.Type)[parseInt(schoolType) - 1]];
                                resolve(new School(enumSchoolType, region, schoolCode));
                            }).catch(reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    })];
            });
        });
    };
    School.MONTHLY_MENU_URL = "sts_sci_md00_001.do";
    School.SCHEDULE_URL = "sts_sci_sf01_001.do";
    School.SCHOOL_CODE_URL = "spr_ccm_cm01_100.do";
    return School;
}());
exports.School = School;
(function (School) {
    var Type;
    (function (Type) {
        Type["KINDERGARTEN"] = "1";
        Type["ELEMENTARY"] = "2";
        Type["MIDDLE"] = "3";
        Type["HIGH"] = "4";
    })(Type = School.Type || (School.Type = {}));
    var Region;
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
exports.School = School;
