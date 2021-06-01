const fs = require('fs');
const path = require('path')
const { Users } = require('../models/users')
// const { rotation } = require('./models/rotation')

async function scheduler() {
    console.log(Users)
    let thing = await Users.find({});
    console.log(thing)
    // const db = JSON.parse(fs.readFileSync(path.resolve('rotation.json'), 'utf8'));
    // let { rotation, lastUp, numberList } = db;
    // let nextUp = ''

    // if (rotation.indexOf(lastUp) === rotation.length - 1) {
    //     nextUp = rotation[0]
    // } else {
    //     nextUp = rotation[rotation.indexOf(lastUp) + 1]
    // }

    // db.lastUp = nextUp;

    // fs.writeFileSync()
    // console.log(nextUp)${nextUp}

    return {
        message: `This week, pasta is at 's house. Cheers!`,
        // numberList: numberList
    }
}

function removeFromList(number) {

}


function addToList(number) {

}

module.exports = { addToList, removeFromList, scheduler }