const { Users } = require('../models/users')
const { Rotation } = require('../models/rotation')
const { LastUp } = require('../models/lastUp')

async function scheduler() {
    const users = await Users.find();
    const rotationData = await Rotation.find();
    const lastUp = await LastUp.find();

    let nextUp = ''

    const validNextUpCandidates = rotationData
    .filter((ele) => {if(ele.active && !ele.skip) {return true}else return false})
    .sort((a, b) => {
        if (a.rotationPosition < b.rotationPosition) {
            return -1;
          }
          if (a.rotationPosition > b.rotationPosition) {
            return 1;
          }
          return 0;
    })
    

const findNextUpIndex = (ele)=> {
    return ele.rotationPosition === lastUp
}

    if (validNextUpCandidates.findIndex(findNextUpIndex) === validNextUpCandidates.length - 1) {
        nextUp = validNextUpCandidates[0]
    } else {
        nextUp = validNextUpCandidates[validNextUpCandidates.findIndex(findNextUpIndex) + 1]
    }

    return {
        message: `This week, pasta is at ${nextUp.names}'s house. Cheers!`,
        numberList: users.map((user) => user.phoneNumber)
    }
}

function removeFromList(number) {

}


function addToList(number) {

}

module.exports = { addToList, removeFromList, scheduler }