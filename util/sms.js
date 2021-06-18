const { Logger } = require('./logger');



function sendMessages(message, numbers) {
  const client = require('twilio')(process.env.SID, process.env.TOKEN);
  numbers.map((number) => {
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
        Logger(`ERROR: Message send failed.\n    error: ${error}`)
      });
  })
}

module.exports = { sendMessages }