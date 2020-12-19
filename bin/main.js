"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ics = require('ics');
const ics_processor_1 = require("./ics-processor");
const table_parser_1 = require("./table-parser");
const fs = require('fs');
const data = table_parser_1.initData('./data.xlsx');
let rawCalendarData = [];
for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
        if (!data[i][j])
            continue;
        data[i][j].forEach((ele) => {
            if (!ele)
                return;
            rawCalendarData.push(ics_processor_1.createRawCalendarData(ele.title, JSON.stringify(ele), ele.location, ele.organizer, ele.start, ele.rrule));
        });
    }
}
const icsText = ics.createEvents(rawCalendarData);
fs.writeFileSync('data.ics', icsText.value);
//# sourceMappingURL=main.js.map