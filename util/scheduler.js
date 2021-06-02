const { Users } = require('../models/users')
const { Rotation } = require('../models/rotation')
const { LastUp } = require('../models/lastUp')

async function scheduler() {
    const users = await Users.find();
    const rotationData = await Rotation.find();
    const lastUpData = await LastUp.find();
    const lastUp = lastUpData[0].lastUp

    let nextUp = ''

    console.log('lastup', lastUp)
    const validNextUpCandidates = rotationData
        .filter((ele) => { if (ele.active && !ele.skip) { return true } else return false })
        .sort((a, b) => {
            if (a.rotationPosition < b.rotationPosition) {
                return -1;
            }
            if (a.rotationPosition > b.rotationPosition) {
                return 1;
            }
            return 0;
        })


    const findNextUpIndex = (ele) => {
        return ele.rotationPosition === lastUp
    }

    if (validNextUpCandidates.findIndex(findNextUpIndex) === validNextUpCandidates.length - 1) {
        nextUp = validNextUpCandidates[0]
    } else {
        nextUp = validNextUpCandidates[validNextUpCandidates.findIndex(findNextUpIndex) + 1]
    }

    const res = await LastUp.updateOne({ lastUp: lastUp }, { lastUp: nextUp.rotationPosition });

    return {
        message: `This week, pasta is at ${nextUp.names}'s house. Cheers! \n P.S. To remove yourself from this list reply to this number with "STOP"`,
        numberList: users.filter((user) => {
            if (user.active) {
              return true
            } else {
                return false
            }
        }).map((ele)=> ele.phoneNumber)
    }
}

async function removeFromList(number) {
    const res = await Users.updateOne({ phoneNumber: number }, { active: false });
}


async function addToList(number) {
    const res = await Users.updateOne({ phoneNumber: number }, { active: true });
}

module.exports = { addToList, removeFromList, scheduler }