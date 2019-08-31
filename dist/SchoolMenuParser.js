"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var SchoolMenu_1 = require("./SchoolMenu");
var SchoolMenuParser;
(function (SchoolMenuParser) {
    function parse(rawData) {
        if (rawData.length < 1)
            throw new Error('불러온 데이터가 올바르지 않습니다.');
        var monthlyMenu = [];
        rawData = rawData.replace(/\s+/g, "");
        var buffer = [];
        var inDiv = false;
        try {
            for (var i = 0; i < rawData.length; i++) {
                if (rawData[i] == 'v') {
                    if (inDiv) {
                        buffer.splice(buffer.length - 4);
                        if (buffer.length > 0)
                            monthlyMenu.push(parseDay(buffer.join('')));
                        buffer = [];
                    }
                    else {
                        i++;
                    }
                    inDiv = !inDiv;
                }
                else if (inDiv) {
                    buffer.push(rawData[i]);
                }
            }
            return monthlyMenu;
        }
        catch (e) {
            throw new Error('급식 정보 파싱에 실패했습니다. API를 최신 버전으로 업데이트 해 주세요.');
        }
    }
    SchoolMenuParser.parse = parse;
    function parseDay(rawData) {
        var menu = new SchoolMenu_1.SchoolMenu();
        rawData = rawData.replace("(석식)", "");
        rawData = rawData.replace("(선)", "");
        var chunk = rawData.split('<br/>');
        var parsingMode = 0;
        var menuStrings = ["", "", ""];
        for (var i = 1; i < chunk.length; i++) {
            if (chunk[i].trim().length < 1)
                continue;
            switch (chunk[i]) {
                case "[조식]":
                    parsingMode = 0;
                    continue;
                case "[중식]":
                    parsingMode = 1;
                    continue;
                case "[석식]":
                    parsingMode = 2;
                    continue;
            }
            if (menuStrings[parsingMode].length > 0)
                menuStrings[parsingMode] += "\n";
            menuStrings[parsingMode] += chunk[i];
        }
        menu.breakfast = menuStrings[0];
        menu.lunch = menuStrings[1];
        menu.dinner = menuStrings[2];
        return menu;
    }
})(SchoolMenuParser = exports.SchoolMenuParser || (exports.SchoolMenuParser = {}));
