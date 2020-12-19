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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUNTIL = exports.getBYDAY = exports.getWeekInterval = exports.weeklyFREQ = exports.createRawCalendarData = void 0;
const config = __importStar(require("./config"));
function createRawCalendarData(title, description, location, organizer, start, rrule) {
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
        productId: 'table2ics-for-sduwh',
        alarms: config.alarms
    };
}
exports.createRawCalendarData = createRawCalendarData;
exports.weeklyFREQ = 'FREQ=WEEKLY;';
function getWeekInterval(num) {
    return `INTERVAL=${num};`;
}
exports.getWeekInterval = getWeekInterval;
function getBYDAY(day) {
    var days = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
    return 'BYDAY=' + days[day] + ';';
}
exports.getBYDAY = getBYDAY;
function getUNTIL(date) {
    return 'UNTIL=' + date.format('YYYYMMDD') + 'T235959Z;';
}
exports.getUNTIL = getUNTIL;
//# sourceMappingURL=ics-processor.js.map