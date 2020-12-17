"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRawCalendarData = exports.TimeSpan = void 0;
class TimeSpan {
    constructor(hours = 0, minutes = 0, seconds = 0, weeks = 0, days = 0) {
        this.weeks = weeks;
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }
}
exports.TimeSpan = TimeSpan;
function createRawCalendarData(title, description, location, organizer, start, duration) {
    return {
        start: start,
        duration: duration,
        location: location,
        organizer: organizer,
        description: description,
        status: "CONFIRMED",
        busyStatus: "BUSY",
        categories: ['University', 'Courses'],
        calName: 'Courses'
    };
}
exports.createRawCalendarData = createRawCalendarData;
//# sourceMappingURL=ics-processor.js.map