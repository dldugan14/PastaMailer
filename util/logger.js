const fs = require('fs')

function Logger(message) {
    const now = new Date()
    fs.appendFileSync('/usr/src/app/main.log', `\n${now.toString()} - ${message}`)
};


module.exports = { Logger }