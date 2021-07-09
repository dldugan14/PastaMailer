const fs = require('fs')
const moment = require('moment')

function Logger(message) {
    fs.appendFileSync('/usr/src/app/main.log', `\n${moment().utcOffset("-07:00").toString()} - ${message}`)
};


module.exports = { Logger }