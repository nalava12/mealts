"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SchoolMenu {
    constructor() {
        this.breakfast = this.lunch = this.dinner = "급식이 없습니다";
    }
    toString() {
        return `[아침]\n${this.breakfast}\n[점심]\n${this.lunch}\n[저녁]\n${this.dinner}`;
    }
}
exports.SchoolMenu = SchoolMenu;
