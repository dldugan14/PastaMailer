import Logger from './logger.js';
import twilio from 'twilio';
const MessagingResponse = twilio.twiml.MessagingResponse;
import { addToList, removeFromList, scheduler } from './scheduler.js';
let STOP = false

 export function smsHandler(req, res) {
  const twiml = new MessagingResponse();
  const { Body, From } = req.body;
  Logger(`Incoming Message:\n    From - ${From}\n    Message - ${Body}`)
  if (Body.toLowerCase().includes('stop')) {
    removeFromList(From.slice(1))
    twiml.message('Gotcha, you have been removed from the pasta notifications.');
  } else if (Body.toLowerCase().includes('start')) {
    addToList(From.slice(1))
    twiml.message('Welcome Back! You have been added to the pasta notifications.');
  } else {
    twiml.message('Sorry Dillon didn\'t program in a response to that. 😅 ');
  }

  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
}


 export function sendMessages(message, numbers) {
  if (!STOP){
  const client = twilio(process.env.SID, process.env.TOKEN);
  numbers.map((number) => {
    Logger(`Attempting Message Send:\n    Number - ${number}\n    SID - ${message.sid}`);
    client.messages.create({
      body: message,
      from: process.env.FROMNUM,
      to: number
    })
      .then(message => {
        console.log(message.sid);
        Logger(`Message sent Succssefully:\n    Number - ${number}\n    SID - ${message.sid}`);
      })
      .catch((error) => {
        Logger(`ERROR: Message send failed.\n  Number - ${number}\n  error: ${error}`)
      });
  })
}else { Logger("ERROR: Emengency Stop Active")}
}

export async function manualText(req, res) {
  const { message } = req.body;
  Logger('Manually sending messages')
  
    const { numberList } = await scheduler()
  Logger(numberList)
  sendMessages(message, numberList)
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end('Sent!');
 
}

  export function emergencyDisable() {
   Logger('disabling sms');
   Logger(STOP);
   STOP = true;
   Logger(STOP);
 }

  export function getStopStatus() {
   Logger("in get stop ")
   return `${STOP}`;
 }