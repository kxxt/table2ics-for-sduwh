"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSingleData = exports.initData = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
function parseOneCourse(course) {
    let ret = {
        id: undefined,
        title: undefined,
        organizer: undefined,
        repeat: undefined,
        location: undefined
    };
    // TODO::.
}
function initData(file) {
    let workbook = xlsx_1.default.readFile(file);
    let sheet = workbook.Sheets['Sheet1'];
    let data = new Array(7);
    // data[weekday][time]
    for (var i = 0; i < 7; i++) {
        data[i] = new Array(6);
    }
    const weekstart = 'B'.charCodeAt(0);
    const weekend = 'H'.charCodeAt(0);
    for (let i = weekstart; i <= weekend; i++) {
        let weekday = i - weekstart;
        let col_char = String.fromCharCode(i);
        for (let j = 4; j <= 9; j++) {
            let time = j - 4;
            data[weekday][time] = processSingleData(sheet[col_char + j.toString()].w);
        }
    }
    return data;
}
exports.initData = initData;
function processSingleData(raw) {
    let splited = raw.trim().replace(/\r/g, '').split('\n');
    const reminder = splited.length % 5;
    if (reminder != 0)
        return null;
    const cnt = splited.length / 5;
    let processed = new Array(cnt);
    for (let k = 0; k < cnt; k++) {
        processed[k] = {
            id: splited[0],
            title: splited[1],
            organizer: splited[2].replace('()', ''),
            repeat: splited[3].replace('[周]', ''),
            location: splited[4]
        };
    }
    return processed;
}
exports.processSingleData = processSingleData;
//# sourceMappingURL=table-parser.js.map