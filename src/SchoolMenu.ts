export class SchoolMenu {
  breakfast: string
  lunch: string
  dinner: string

  constructor() {
    this.breakfast = this.lunch = this.dinner = "급식이 없습니다"
  }

  toString(): string {
    return `[아침]\n${this.breakfast}\n[점심]\n${this.lunch}\n[저녁]\n${this.dinner}`
  }
}