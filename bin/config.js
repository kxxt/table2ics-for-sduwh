"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.alarms = exports.summer_delta = exports.nightcourseBegin_winter = exports.afternooncourseBegin_winter = exports.morningcourseBegin = exports.courseInBetweenTime = exports.courseDuration = exports.summerTimeRuleEnd = exports.summerTimeRuleStart = exports.mondayOfFirstWeek = exports.mondayOfFirstWeek_winter = exports.mondayOfFirstWeek_summer = exports.targetStartYear = void 0;
// Configurations
const moment_1 = __importDefault(require("moment"));
exports.targetStartYear = 2020;
exports.mondayOfFirstWeek_summer = (() => moment_1.default(`${exports.targetStartYear}-09-07`));
exports.mondayOfFirstWeek_winter = (() => moment_1.default(`${exports.targetStartYear}-03-01`));
exports.mondayOfFirstWeek = exports.mondayOfFirstWeek_summer;
// 全闭区间:
exports.summerTimeRuleStart = moment_1.default(`${exports.targetStartYear}-05-01`);
exports.summerTimeRuleEnd = moment_1.default(`${exports.targetStartYear}-10-07`);
exports.courseDuration = moment_1.default.duration('1:50');
exports.courseInBetweenTime = moment_1.default.duration(20, 'minutes');
exports.morningcourseBegin = moment_1.default.duration('8:00');
exports.afternooncourseBegin_winter = moment_1.default.duration('14:00');
exports.nightcourseBegin_winter = moment_1.default.duration('19:00');
exports.summer_delta = moment_1.default.duration(30, 'minutes');
exports.alarms = [
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
];
//# sourceMappingURL=config.js.map