import ics from 'ics'

export class TimeSpan {
    weeks: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;

    constructor(hours: number = 0, minutes: number = 0, seconds: number =0,weeks: number = 0, days: number = 0) {
        this.weeks = weeks
        this.days = days
        this.hours = hours
        this.minutes = minutes
        this.seconds = seconds
    }
}

export function createRawCalendarData(
    title: string,
    description: string,
    location: string,
    organizer: string,
    start: number[],
    duration: TimeSpan
) {
    return {
        start: start,
        duration: duration,
        location: location,
        organizer:organizer,
        description: description,
        
        status:"CONFIRMED",
        busyStatus:"BUSY",
        categories: ['University','Courses'],
        calName:'Courses'
    }
}