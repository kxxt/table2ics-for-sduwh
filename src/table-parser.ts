import xlsx from 'xlsx';

function parseOneCourse(course: string) {
    let ret = {
        id: undefined,
        title: undefined,
        organizer: undefined,
        repeat: undefined,
        location: undefined
    }
    // TODO::.
}

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
            data[weekday][time] =processSingleData(sheet[col_char + j.toString()].w)
        }
    }
    return data;
}
export function processSingleData(raw: string) {
    let splited = raw.trim().replace(/\r/g, '').split('\n')
    const reminder = splited.length % 5
    if (reminder != 0) return null;
    const cnt = splited.length / 5
    let processed: any[] = new Array(cnt)
    for (let k = 0; k < cnt; k++) {
        processed[k] = {
            id: splited[0],
            title: splited[1],
            organizer: splited[2].replace('()',''),
            repeat: splited[3].replace('[周]', ''),
            location: splited[4]
        }
    }
    return processed
}
