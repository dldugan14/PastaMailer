import fs from 'fs';
const path = require('path')


export default function scheduler() {
    let { rotation, lastUp, numberList } = JSON.parse(fs.readFileSync(path.resolve('rotation.json'), 'utf8'));
    let nextUp = ''


    if (rotation.indexOf(lastUp) === rotation.length - 1) {
        nextUp = rotation[0]
    } else {
        nextUp = rotation[rotation.indexOf(lastUp) + 1]
    }

    console.log(nextUp)

    return {
        message: `This week pasta is at ${nextUp}'s house. Cheers!`,
        numberList: numberList
    }
}