import { Users } from '../models/users.js'
import { Rotation } from '../models/rotation.js'
import { LastUp } from '../models/lastUp.js'
import  Logger  from './logger.js'
import { Updated } from '../models/updated.js'
import { sendMessages } from './sms.js'
import moment from 'moment';


export async function scheduler() {
    let users = []
    let rotationData = []
    let lastUpData = []

    try {
        users = await Users.find();
        rotationData = await Rotation.find();
        lastUpData = await LastUp.find();
    } catch (error) {
        Logger(`db Connection error: ${error}`)
        return null;
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
        Logger(`Update info: ${JSON.stringify(res)}`)
    } catch (error) {
        Logger(`ERROR: db connection issue: ${error}`)
    }

    const numberList = users.filter((user) => {
        if (user.firstName === 'Geoff' && nextUp.names !== 'Geoff and Karina') {
            return false
        }

        if ((user.firstName === 'Lisa' || user.firstName === 'Kenny') && nextUp.names === 'Geoff and Karina') {
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
        message: `This week, pasta is at ${nextUp.names}'s house starting at 1pm. Cheers! \n\nP.S. To remove yourself from this list reply to this number with "STOP"`,
        numberList
    }
}

export async function removeFromList(number) {
    Logger('Remove ' + number.slice(-10))
    const res = await Users.updateOne({ phoneNumber: number.slice(-10) }, { active: false });
    Logger(res.n, res.nModified)
}


export async function addToList(number) {
    Logger('Activate ' + number.slice(-10))
    const res = await Users.updateOne({ phoneNumber: number.slice(-10) }, { active: true });
    Logger(res.n, res.nModified)
}

export async function runSchedule() {
    const updatedData = await Updated.find();
    const lastUpdated = moment(updatedData[0].updated)
    try {   
        if (moment().subtract(6, 'days').valueOf() >= lastUpdated.valueOf()) {

            Logger('Sending Messages')
            const { message, numberList } = await scheduler()

            sendMessages(message, numberList)
        
            Updated.updateOne({ updated: updatedData.updated }, { updated: moment().format() });
        } else {
            Logger(`Blocked by updated check\n    last updated ${lastUpdated.toString()}`)
        }
    } catch (error) {
        Logger(error)
    }
}


export async function tradePastas(inUser, outUser) {
    let rotationData = []

    try {
        rotationData = await Rotation.find();
    } catch (error) {
        Logger(`db Connection error: ${error}`)
        return "Sorry! Something went wrong!";
    }

    const foundOutUser = rotationData.find(element => element.names.toLowerCase().includes(outUser));
    const foundInUser = rotationData.find(element => element.names.toLowerCase().includes(inUser));
    
    if(!foundInUser) {
        return `Can't find ${inUser}`
    } else if (!foundOutUser) {
        return `Can't find ${outUser}`
    } 

let newFoundIn = { ...foundInUser._doc, swap: true, swapWith: foundOutUser.id }
let newFoundOut = { ...foundOutUser._doc, swap: true, swapWith: foundInUser.id }
Logger(foundInUser)
Logger(foundOutUser)
Logger(newFoundIn)
Logger(newFoundOut)

    Rotation.findOneAndUpdate({ _id: foundInUser._id }, newFoundIn);
    Rotation.findOneAndUpdate({ _id: foundOutUser._id }, newFoundOut);

    return `Awesome! Swaped ${foundOutUser.names}'s Pasta with ${foundInUser.names}'s Pasta.`
}


