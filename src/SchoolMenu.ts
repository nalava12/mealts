import { decode as htmlDecode } from 'he'

export class SchoolMenu {
  private _breakfast: string
  private _lunch: string
  private _dinner: string

  get breakfast(): string {
    return this._breakfast
  }
  set breakfast(str: string) {
    this._breakfast = htmlDecode(str)
  }

  get lunch(): string {
    return this._lunch
  }
  set lunch(str: string) {
    this._lunch = htmlDecode(str)
  }

  get dinner(): string {
    return this._dinner
  }
  set dinner(str: string) {
    this._dinner = htmlDecode(str)
  }
  
  constructor() {
    this._breakfast = this._lunch = this._dinner = "급식이 없습니다"
  }

  toString(): string {
    return `[아침]\n${this.breakfast}\n[점심]\n${this.lunch}\n[저녁]\n${this.dinner}`
  }
}