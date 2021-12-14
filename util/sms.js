const { Logger } = require('./logger');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const { addToList, removeFromList, scheduler } = require('./scheduler');
let STOP = false

function smsHandler(req, res) {
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


function sendMessages(message, numbers) {
  if (!STOP){
  const client = require('twilio')(process.env.SID, process.env.TOKEN);
  numbers.map((number) => {
    Logger(`Attempting MAssage Send:\n    Number - ${number}\n    SID - ${message.sid}`);
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
}
}

async function manualText(req, res) {
  const { message } = req.body;
  Logger(message);
  Logger('Manually sending messages')
  const { numberList } = await scheduler()
  sendMessages(message, numberList)
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end('Sent!');
}

 function emergencyDisable() {
   Logger('disabling sms');
   Logger(STOP);
   STOP = true;
   Logger(STOP);
 }

 function getStopStatus() {
   Logger("in get stop ")
   return `${STOP}`;
 }

module.exports = { sendMessages, smsHandler, manualText, emergencyDisable, getStopStatus }