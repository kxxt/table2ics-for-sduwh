import xlsx from 'xlsx';
import { weeklyFREQ, getWeekInterval, getBYDAY, getUNTIL } from './ics-processor'
import * as config from './config'
import moment from 'moment'


export function initData(file: string): any[][] {
    let workbook = xlsx.readFile(file);
    let sheet = workbook.Sheets['Sheet1'];
    let data: any[][] = new Array(7);
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
            data[weekday][time] = processSingleData(sheet[col_char + j.toString()].w, weekday, time)
        }
    }
    return data;
}


export function processSingleData(raw: string, weekday: number, course: number) {
    let splited = raw.trim().replace(/\r/g, '').split('\n')
    splited = splited.filter(s => {
        return s && s.trim()
    })
    const reminder = splited.length % 5
    if (reminder != 0 || splited.length < 5) return null;
    const cnt = splited.length / 5
    let processed: any[] = []
    let added: any[] = [];
    for (let k = 0; k < cnt; k++) {
        let raw_repeat = splited[3+5*k]
        let even_r = raw_repeat.indexOf('双周')
        let odd_r = raw_repeat.indexOf('单周')
        if(even_r!=-1||odd_r!=-1){
            let mod = even_r!=-1?0:1
            let start_end= raw_repeat.split('-')
            let start = parseInt(start_end[0])
            let end = parseInt(start_end[1])
            raw_repeat = ''
            for(let i=start;i<=end;i++){
                if(i%2==mod){
                    raw_repeat += i.toString()+','
                }
            }
            raw_repeat=raw_repeat.slice(0,raw_repeat.length-1)
            raw_repeat+='[周]'
        }
        let repeat = parseRepeat(raw_repeat.replace('[周]', ''), weekday)
        let is_multi = false;
        let pps = []
        if (typeof (repeat[2]) == 'object') {
            is_multi = true;
            for (let i = 0; i < repeat[2].length; i++) {
                let pp: any = {
                    id: splited[5*k],
                    title: splited[1+5*k],
                    organizer: splited[2+5*k].replace('()', ''),
                    location: splited[4+5*k],
                    weekday: weekday,
                    course: course,
                    startWeek: repeat[2][i],
                    endWeek: repeat[2][i],
                }

                processed.push(pp)
            }
        } else {
            let preprocessed: any = {
                id: splited[5*k],
                title: splited[1+5*k],
                organizer: splited[2+5*k].replace('()', ''),
                rrule: repeat[2],
                location: splited[4+5*k],
                weekday: weekday,
                course: course,
                startWeek: repeat[0],
                endWeek: repeat[1],
            }
            let patch = makeSegments(preprocessed);
            preprocessed.is_summer = patch.raw.is_summer
            preprocessed.startWeek = patch.raw.start;
            preprocessed.endWeek = patch.raw.end;
            processed.push(preprocessed)
            if (patch.added) added.push(patch.added)
        }

    }
    added.forEach(ele => {
        if (ele) {
            processed.push(ele)
        }
    });
    for (let i = 0; i < processed.length; i++) {
        let ele = processed[i]
        let se = processStartEndDate(ele)
        ele.startDate = se.startDate
        ele.endDate = se.endDate
        ele.start = processCourseStartTime(ele)
        if (!ele.rrule) {
            ele.is_summer = ele.startDate.isBetween(config.summerTimeRuleStart, config.summerTimeRuleEnd, 'day', '[]')
        } else {
            ele.rrule += getUNTIL(ele.endDate)
        }
    }
    return processed
}

export function parseRepeat(repeat: string, byday: number) {
    var splited = repeat.split('-')
    if (splited.length > 1) {
        let start = parseInt(splited[0])
        let end = parseInt(splited[1])
        return [start - 1, end - 1, weeklyFREQ + getBYDAY(byday)]
    }
    splited = repeat.split(',');
    let weeks = new Array(splited.length)
    for (let i = 0; i < weeks.length; i++) {
        weeks[i] = parseInt(splited[i]) - 1
    }
    if (splited.length > 1) {
        function is_repeat(num: number) {
            let flag: Boolean = true;
            let index: number = 1;
            while (flag == true) {
                if (index == weeks.length) break;

                flag = (
                    weeks[index] == weeks[index - 1] + num
                )
                index++;
            }
            return flag
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
            return [weeks[0], weeks[weeks.length - 1], weeklyFREQ + getWeekInterval(interval) + getBYDAY(byday)]
        } 
    }
    return [weeks[0], weeks[weeks.length - 1], weeks]  //无重复
}
export function isInSummer(date: moment.Moment) {
    return date.isBetween(config.summerTimeRuleStart, config.summerTimeRuleEnd, 'day', '[]')
}
export function makeSegments(data: any) {
    var patch: any = {}
    let datestart = config.mondayOfFirstWeek().add(data.weekday).add(data.startWeek, 'weeks');
    let dateend = config.mondayOfFirstWeek().add(data.weekday).add(data.endWeek, 'weeks');
    let date = moment(datestart)
    let cnt = 0

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
                }
                patch.added = JSON.parse(JSON.stringify(data));
                patch.added.is_summer = false;
                patch.added.startWeek = data.startWeek + cnt;
                patch.added.endWeek = data.endWeek
            } else {
                patch.raw = {
                    start: data.startWeek,
                    end: data.endWeek,
                    is_summer: true
                }
            }
            return patch;
        } else {
            patch.raw = {
                start: data.startWeek,
                end: data.endWeek,
                is_summer: true
            }
            return patch;
        }
    } else {
        if (isInSummer(dateend)) {
            while (!date.isBetween(config.summerTimeRuleStart, config.summerTimeRuleEnd, 'day', '[]')) {
                date = date.add(1, 'w');
                cnt++;
            }
            if (cnt != data.endWeek - data.startWeek) {
                patch.raw = {
                    start: data.startWeek,
                    end:data.startWeek + cnt - 1,
                    is_summer: false
                }
                patch.added = JSON.parse(JSON.stringify(data));
                patch.added.is_summer = true;
                patch.added.startWeek =data.startWeek +  cnt;
                patch.added.endWeek = data.endWeek;
            } else {
                patch.raw = {
                    start: data.startWeek,
                    end: data.endWeek,
                    is_summer: false
                }
            }
            return patch;
        }else{
            patch.raw = {
                start: data.startWeek,
                end: data.endWeek,
                is_summer: false
            }
            return patch;
        }
    }

}



export function processStartEndDate(data: any) {
    let base = config.mondayOfFirstWeek().add(data.weekday, 'days');
    let start = moment(base).add(data.startWeek, 'w')
    let end = moment(base).add(data.endWeek, 'w')
    return {
        startDate: start,
        endDate: end
    }
}

export function processCourseStartTime(data: any) {
    let morningBase = moment(data.startDate.startOf('day')).add(config.morningcourseBegin);
    let afternoonBase = moment(data.startDate.startOf('day')).add(config.afternooncourseBegin_winter)
    let nightBase = moment(data.startDate.startOf('day')).add(config.nightcourseBegin_winter)
    if (data.is_summer) {
        afternoonBase.add(config.summer_delta);
        nightBase.add(config.summer_delta);
    }
    switch (data.course) {
        case 0:
            return morningBase
        case 1:
            return SkipCourse(morningBase)
        case 2:
            return afternoonBase
        case 3:
            return SkipCourse(afternoonBase)
        case 4:
            return nightBase
        case 5:
            return SkipCourse(nightBase)
        default:
            throw "Fuck you, no more courses!"
    }
}

function SkipCourse(course: moment.Moment) {
    return moment(course.add(config.courseDuration)).add(config.courseInBetweenTime)
}
