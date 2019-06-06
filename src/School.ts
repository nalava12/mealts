import https from 'https'
import { SchoolMenu } from './SchoolMenu';
import { SchoolSchedule } from './SchoolSchedule';
import { SchoolMenuParser } from './SchoolMenuParser';
import { SchoolScheduleParser } from './SchoolScheduleParser';
import { Utils } from './Utils'

export class School {
  static readonly MONTHLY_MENU_URL = "sts_sci_md00_001.do"
  static readonly SCHEDULE_URL = "sts_sci_sf01_001.do"
  static readonly SCHOOL_CODE_URL = "spr_ccm_cm01_100.do"

  type: School.Type
  region: School.Region
  code: string
  urlAdapter: UrlAdapter

  monthlyMenuCache: Map<number, SchoolMenu[]>
  monthlyScheduleCache: Map<number, SchoolSchedule[]>

  constructor(type: School.Type, region: School.Region, code: string, urlAdapter?: UrlAdapter) {
    this.type = type
    this.region = region
    this.code = code
    this.monthlyMenuCache = new Map()
    this.monthlyScheduleCache = new Map()
    this.urlAdapter = urlAdapter || FetchUrlAdapter.Instance
  }

  async getMonthlyMenu(year: number, month: number): Promise<SchoolMenu[]> {
    let cacheKey = year * 12 + month;
    if(this.monthlyMenuCache.has(cacheKey))
      return this.monthlyMenuCache.get(cacheKey) || []
    
    let targetUrl = `https://stu.${this.region}/${School.MONTHLY_MENU_URL}`
    targetUrl += `?schulCode=${this.code}`
    targetUrl += `&schulCrseScCode=${this.type}`
    targetUrl += `&schulKndScCode=0${this.type}`
    targetUrl += `&schYm=${year}${month.toString().padStart(2, '0')}`
    targetUrl += '&'

    return new Promise<SchoolMenu[]>((resolve, reject) => {
      try {
        this.urlAdapter.getContentFromURL(new URL(targetUrl)).then(content => {
          content = Utils.before(Utils.after(content, "<tbody>"), "</tbody>")
  
          let monthlyMenu = SchoolMenuParser.parse(content)
          this.monthlyMenuCache.set(cacheKey, monthlyMenu)
  
          resolve(monthlyMenu)
        }).catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  }

  async getMonthlySchedule(year: number, month: number): Promise<SchoolSchedule[]> {
    let cacheKey = year * 12 + month;
    if(this.monthlyScheduleCache.has(cacheKey))
      return this.monthlyScheduleCache.get(cacheKey) || []
    
    let targetUrl = `https://stu.${this.region}/${School.SCHEDULE_URL}`
    targetUrl += `?schulCode=${this.code}`
    targetUrl += `&schulCrseScCode=${this.type}`
    targetUrl += `&schulKndScCode=0${this.type}`
    targetUrl += `&ay=${year}`
    targetUrl += `&mm=${month.toString().padStart(2, '0')}`
    targetUrl += '&'

    return new Promise<SchoolSchedule[]>((resolve, reject) => {
      try {
        this.urlAdapter.getContentFromURL(new URL(targetUrl)).then(content => {
          content = Utils.before(Utils.after(content, "<tbody>"), "</tbody>")
  
          let monthlySchedule = SchoolScheduleParser.parse(content)
          this.monthlyScheduleCache.set(cacheKey, monthlySchedule)
  
          resolve(monthlySchedule)
        }).catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  }

  clearCache() {
    this.monthlyMenuCache.clear()
    this.monthlyScheduleCache.clear()
  }

  static async find(region: School.Region, name: string, urlAdapter?: UrlAdapter): Promise<School> {
    let targetUrl = `https://par.${region}/${School.SCHOOL_CODE_URL}`;
    targetUrl += `?kraOrgNm=${encodeURIComponent(name)}`;
    targetUrl += '&';
    return new Promise<School>((resolve, reject) => {
      try {
      (urlAdapter || FetchUrlAdapter.Instance).getContentFromURL(new URL(targetUrl)).then(content => {
        content = Utils.before(Utils.after(content, "orgCode"), "schulCrseScCodeNm");

        let schoolCode = content.substring(3, 13);
        let schoolType = Utils.before(Utils.after(content, 'schulCrseScCode\":\"'), '\"');
        
        let enumSchoolType = School.Type[Object.keys(School.Type)[parseInt(schoolType) - 1] as any] as School.Type;
        resolve(new School(enumSchoolType, region, schoolCode))
        }).catch(reject)
      } catch (e) {
        reject(e)
      }
    })
  }
}

export namespace School {
  export enum Type {
    KINDERGARTEN = "1",
    ELEMENTARY = "2",
    MIDDLE = "3",
    HIGH = "4"
  }
  
  export enum Region {
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

export interface UrlAdapter {
  getContentFromURL: (url: URL) => Promise<string>
}

export class FetchUrlAdapter implements UrlAdapter {
  private static _instance: FetchUrlAdapter
  private constructor() {}
  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  getContentFromURL(url: URL) {
    return new Promise<string>((resolve, reject) => {
      fetch(url.href).then(res => res.text()).then(resolve).catch(reject)
    })
  }
}

export class NativeUrlAdapter implements UrlAdapter {
  private static _instance: NativeUrlAdapter
  private constructor() {}
  public static get Instance() {
    return this._instance || (this._instance = new this())
  }

  getContentFromURL(url: URL) {
    return new Promise<string>((resolve, reject) => {
      https.get(url, res => {
        let resData = ''
        res.on('data', chunk => {
          resData += chunk
        })

        res.on('end', () => {
          resolve(resData)
        })

        res.on('error', reject)
      })
    })
  }
}