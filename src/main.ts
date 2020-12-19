const ics = require('ics')
import { createRawCalendarData } from './ics-processor'
import { initData } from './table-parser'
import moment = require('moment')
const fs = require('fs')

const data = initData('./data.xlsx')
let rawCalendarData: any[] = []
for(let i = 0; i < data.length; i++) {
    for(let j = 0; j < data[i].length; j++) {
        if(!data[i][j])continue;
        data[i][j].forEach((ele:any) => {
            if(!ele)return;
            rawCalendarData.push(createRawCalendarData(
                ele.title,
                JSON.stringify(ele),
                ele.location,
                ele.organizer,
                ele.start,
                ele.rrule
            ))
        });
    }
}
const icsText = ics.createEvents(rawCalendarData)
fs.writeFileSync('data.ics',icsText.value)