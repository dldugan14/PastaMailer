import fs from 'fs'
import moment from 'moment'

export default function Logger(message) {
    fs.appendFileSync('/usr/src/app/main.log', `\n${moment().utcOffset("-07:00").toString()} - ${JSON.stringify(message)}`)
};