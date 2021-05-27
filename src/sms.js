


export default function sendMessages(message, numbers) {
  const client = require('twilio')(process.env.SID, process.env.TOKEN);
  numbers.map((number) => {
    client.messages.create({
      body: message,
      from: process.env.FROMNUM,
      to: number
    })
      .then(message => console.log(message.sid));
  })
}

