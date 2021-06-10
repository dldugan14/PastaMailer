const { Users } = require('../models/users')
const { Rotation } = require('../models/rotation')
const { LastUp } = require('../models/lastUp');
const { Logger } = require('./logger');

async function scheduler() {
    const users = []
    const rotationData = []
    const lastUpData = []

    try {
        users = await Users.find();
        rotationData = await Rotation.find();
        lastUpData = await LastUp.find();
    } catch (error) {
        
    }
   
    const lastUp = lastUpData[0].lastUp

    let nextUp = ''

    Logger('Last up ' + lastUp)
    
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

    try {
        const res = await LastUp.updateOne({ lastUp: lastUp }, { lastUp: nextUp.rotationPosition });
        Logger(`Update info: ${res}`)
    } catch (error) {
        Logger(`ERROR: db connection issue: ${error}`)
    }
    
    const numberList = users.filter((user) => {
            if (user.firstName === 'Geoff' && nextup.names !== 'Geoff and Karina'){
                return false
            }

            if ((user.firstName === 'Lisa' || user.firstName === 'Kenny') && nextup.names === 'Geoff and Karina') {
                return false
            }

            if (user.active) {
                return true
            } else {
                return false
            }
        }).map((ele) => ele.phoneNumber)

    Logger(`List of numbers: ${numberList}`)
    return {
        message: `Hello everybody!\nDillon built out this app to let everyone know whos house pasta is at this week.\nIt sends a message once a week on friday at noon.\n\nThis week, pasta is at ${nextUp.names}'s house. Cheers! \n\n\nP.S. To remove yourself from this list reply to this number with "STOP"`,
        numberList
    }
}

async function removeFromList(number) {
    Logger('Remove ' + number)
    const res = await Users.updateOne({ phoneNumber: number }, { active: false });
}


async function addToList(number) {
    Logger('Activate ' + number)
    const res = await Users.updateOne({ phoneNumber: number }, { active: true });
}

module.exports = { addToList, removeFromList, scheduler }