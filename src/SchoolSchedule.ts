export class SchoolSchedule {
  schedule: string

  constructor(schedule?: string) {
    this.schedule = schedule || ""
  }

  toString(): string {
    return this.schedule
  }
}