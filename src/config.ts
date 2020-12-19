// Configurations
import moment from 'moment';

export const targetStartYear = 2020;
export const mondayOfFirstWeek_summer = (() => moment(`${targetStartYear}-09-07`));
export const mondayOfFirstWeek_winter = (() => moment(`${targetStartYear}-03-01`));
export const mondayOfFirstWeek = mondayOfFirstWeek_summer;


// 全闭区间:
export const summerTimeRuleStart = moment(`${targetStartYear}-05-01`)
export const summerTimeRuleEnd = moment(`${targetStartYear}-10-07`)

export const courseDuration = moment.duration('1:50')
export const courseInBetweenTime = moment.duration(20, 'minutes')

export const morningcourseBegin = moment.duration('8:00')
export const afternooncourseBegin_winter = moment.duration('14:00')
export const nightcourseBegin_winter = moment.duration('19:00')
export const summer_delta = moment.duration(30, 'minutes')

export const alarms = [
    {
        action: 'audio',
        trigger: { hours: 0, minutes: 17, before: true },
        repeat: 2,
        attachType: 'VALUE=URI',
    },
    {
        action: 'audio',
        trigger: { hours: 0, minutes: 10, before: true },
        repeat: 2,
        attachType: 'VALUE=URI',
    },
]

