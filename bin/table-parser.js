"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCourseStartTime = exports.processStartEndDate = exports.makeSegments = exports.isInSummer = exports.parseRepeat = exports.processSingleData = exports.initData = void 0;
const xlsx_1 = __importDefault(require("xlsx"));
const ics_processor_1 = require("./ics-processor");
const config = __importStar(require("./config"));
const moment_1 = __importDefault(require("moment"));
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
            data[weekday][time] = processSingleData(sheet[col_char + j.toString()].w, weekday, time);
        }
    }
    return data;
}
exports.initData = initData;
function processSingleData(raw, weekday, course) {
    let splited = raw.trim().replace(/\r/g, '').split('\n');
    splited = splited.filter(s => {
        return s && s.trim();
    });
    const reminder = splited.length % 5;
    if (reminder != 0 || splited.length < 5)
        return null;
    const cnt = splited.length / 5;
    let processed = [];
    let added = [];
    for (let k = 0; k < cnt; k++) {
        let repeat = parseRepeat(splited[3 + 5 * k].replace('[周]', ''), weekday);
        let is_multi = false;
        let pps = [];
        if (typeof (repeat[2]) == 'object') {
            is_multi = true;
            for (let i = 0; i < repeat[2].length; i++) {
                let pp = {
                    id: splited[5 * k],
                    title: splited[1 + 5 * k],
                    organizer: splited[2 + 5 * k].replace('()', ''),
                    location: splited[4 + 5 * k],
                    weekday: weekday,
                    course: course,
                    startWeek: repeat[2][i],
                    endWeek: repeat[2][i],
                };
                processed.push(pp);
            }
        }
        else {
            let preprocessed = {
                id: splited[5 * k],
                title: splited[1 + 5 * k],
                organizer: splited[2 + 5 * k].replace('()', ''),
                rrule: repeat[2],
                location: splited[4 + 5 * k],
                weekday: weekday,
                course: course,
                startWeek: repeat[0],
                endWeek: repeat[1],
            };
            let patch = makeSegments(preprocessed);
            preprocessed.is_summer = patch.raw.is_summer;
            preprocessed.startWeek = patch.raw.start;
            preprocessed.endWeek = patch.raw.end;
            processed.push(preprocessed);
            if (patch.added)
                added.push(patch.added);
        }
    }
    added.forEach(ele => {
        if (ele) {
            processed.push(ele);
        }
    });
    for (let i = 0; i < processed.length; i++) {
        let ele = processed[i];
        let se = processStartEndDate(ele);
        ele.startDate = se.startDate;
        ele.endDate = se.endDate;
        ele.start = processCourseStartTime(ele);
        if (!ele.rrule) {
            ele.is_summer = ele.startDate.isBetween(config.summerTimeRuleStart, config.summerTimeRuleEnd, 'day', '[]');
        }
        else {
            ele.rrule += ics_processor_1.getUNTIL(ele.endDate);
        }
    }
    return processed;
}
exports.processSingleData = processSingleData;
function parseRepeat(repeat, byday) {
    var splited = repeat.split('-');
    if (splited.length > 1) {
        let start = parseInt(splited[0]);
        let end = parseInt(splited[1]);
        return [start - 1, end - 1, ics_processor_1.weeklyFREQ + ics_processor_1.getBYDAY(byday)];
    }
    splited = repeat.split(',');
    let weeks = new Array(splited.length);
    for (let i = 0; i < weeks.length; i++) {
        weeks[i] = parseInt(splited[i]) - 1;
    }
    if (splited.length > 1) {
        function is_repeat(num) {
            let flag = true;
            let index = 1;
            while (flag == true) {
                if (index == weeks.length)
                    break;
                flag = (weeks[index] == weeks[index - 1] + num);
                index++;
            }
            return flag;
        }
        let flag = false;
        let interval = 0;
        for (let i = 2; i <= 16; i++) {
            if (is_repeat(i)) {
                flag = true;
                interval = i;
            }
        }
        if (flag) {
            return [weeks[0], weeks[weeks.length - 1], ics_processor_1.weeklyFREQ + ics_processor_1.getWeekInterval(interval) + ics_processor_1.getBYDAY(byday)];
        }
    }
    return [weeks[0], weeks[weeks.length - 1], weeks]; //无重复
}
exports.parseRepeat = parseRepeat;
function isInSummer(date) {
    return date.isBetween(config.summerTimeRuleStart, config.summerTimeRuleEnd, 'day', '[]');
}
exports.isInSummer = isInSummer;
function makeSegments(data) {
    var patch = {};
    let datestart = config.mondayOfFirstWeek().add(data.weekday).add(data.startWeek, 'weeks');
    let dateend = config.mondayOfFirstWeek().add(data.weekday).add(data.endWeek, 'weeks');
    let date = moment_1.default(datestart);
    let cnt = 0;
    if (isInSummer(datestart)) {
        if (!isInSummer(dateend)) {
            while (date.isBetween(config.summerTimeRuleStart, config.summerTimeRuleEnd, 'day', '[]')) {
                date = date.add(1, 'w');
                cnt++;
            }
            if (cnt != data.endWeek - data.startWeek) {
                patch.raw = {
                    start: data.startWeek,
                    end: data.startWeek + cnt - 1,
                    is_summer: true
                };
                patch.added = JSON.parse(JSON.stringify(data));
                patch.added.is_summer = false;
                patch.added.startWeek = data.startWeek + cnt;
                patch.added.endWeek = data.endWeek;
            }
            else {
                patch.raw = {
                    start: data.startWeek,
                    end: data.endWeek,
                    is_summer: true
                };
            }
            return patch;
        }
        else {
            patch.raw = {
                start: data.startWeek,
                end: data.endWeek,
                is_summer: true
            };
            return patch;
        }
    }
    else {
        if (isInSummer(dateend)) {
            while (!date.isBetween(config.summerTimeRuleStart, config.summerTimeRuleEnd, 'day', '[]')) {
                date = date.add(1, 'w');
                cnt++;
            }
            if (cnt != data.endWeek - data.startWeek) {
                patch.raw = {
                    start: data.startWeek,
                    end: data.startWeek + cnt - 1,
                    is_summer: false
                };
                patch.added = JSON.parse(JSON.stringify(data));
                patch.added.is_summer = true;
                patch.added.startWeek = data.startWeek + cnt;
                patch.added.endWeek = data.endWeek;
            }
            else {
                patch.raw = {
                    start: data.startWeek,
                    end: data.endWeek,
                    is_summer: false
                };
            }
            return patch;
        }
        else {
            patch.raw = {
                start: data.startWeek,
                end: data.endWeek,
                is_summer: false
            };
            return patch;
        }
    }
}
exports.makeSegments = makeSegments;
function processStartEndDate(data) {
    let base = config.mondayOfFirstWeek().add(data.weekday, 'days');
    let start = moment_1.default(base).add(data.startWeek, 'w');
    let end = moment_1.default(base).add(data.endWeek, 'w');
    return {
        startDate: start,
        endDate: end
    };
}
exports.processStartEndDate = processStartEndDate;
function processCourseStartTime(data) {
    let morningBase = moment_1.default(data.startDate.startOf('day')).add(config.morningcourseBegin);
    let afternoonBase = moment_1.default(data.startDate.startOf('day')).add(config.afternooncourseBegin_winter);
    let nightBase = moment_1.default(data.startDate.startOf('day')).add(config.nightcourseBegin_winter);
    if (data.is_summer) {
        afternoonBase.add(config.summer_delta);
        nightBase.add(config.summer_delta);
    }
    switch (data.course) {
        case 0:
            return morningBase;
        case 1:
            return SkipCourse(morningBase);
        case 2:
            return afternoonBase;
        case 3:
            return SkipCourse(afternoonBase);
        case 4:
            return nightBase;
        case 5:
            return SkipCourse(nightBase);
        default:
            throw "Fuck you, no more courses!";
    }
}
exports.processCourseStartTime = processCourseStartTime;
function SkipCourse(course) {
    return moment_1.default(course.add(config.courseDuration)).add(config.courseInBetweenTime);
}
//# sourceMappingURL=table-parser.js.map