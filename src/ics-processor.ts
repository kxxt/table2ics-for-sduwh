import ics from 'ics'
import * as config from './config'
import moment from 'moment'

export function createRawCalendarData(
    title: string,
    description: string,
    location: string,
    organizer: string,
    start: moment.Moment,
    rrule: string
) {
    return {
        title: title,
        start: start.format('YYYY-M-D-H-m').split("-"),
        duration: { 
            weeks: 0, 
            days: 0,
            hours: config.courseDuration.get('hours'), 
            minutes: config.courseDuration.get('minutes'), 
            seconds: 0
        },
        location: location,
        organizer: { name: organizer },
        attendees: [{ 'name': organizer }, { 'name': 'You' }],
        description: description,
        recurrenceRule: rrule,
        status: "CONFIRMED",
        busyStatus: "BUSY",
        categories: ['University', 'Courses'],
        calName: 'Courses',
        productId:'table2ics-for-sduwh',
        alarms: config.alarms
    }
}

export const weeklyFREQ: string = 'FREQ=WEEKLY;'
export function getWeekInterval(num: number) {
    return `INTERVAL=${num};`
}
export function getBYDAY(day: number) {
    var days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
    return 'BYDAY=' + days[day] + ';';
}

export function getUNTIL(date: moment.Moment) {
    return 'UNTIL=' + date.format('YYYYMMDD') + 'T235959Z;'
}