require("dotenv").config();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const MessagingResponse = require('twilio').twiml.MessagingResponse;

const schedule = require('node-schedule');
const { scheduler, addToList, removeFromList } = require('./util/scheduler');
const { sendMessages } = require("./util/sms");

const mongoose = require('mongoose')
mongoose.connect('mongodb://mongodb:27017/pasta', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'CONNECTION ERROR'))
db.once('open', function () {
     console.log('Connection Established.')
})

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// Every Friday at 12pm  "0 12 * * 5"
// schedule.scheduleJob("*/10 * * * * *", async function () {
//      console.log('cronjob')
// const { Updated } = require('../models/updated')
//     const updated = await Updated.find();

    // if(updated)
//      const { message, numberList } = await scheduler()
//      console.log(message, numberList)
//      // sendMessages(message, numberList)
// });

app.post('/sms', (req, res) => {
     const twiml = new MessagingResponse();
     const { Body, From } = req.body;

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
});

app.get("/test", async (req, res) => {
     console.log(db.models)
     const { message, numberList } = await scheduler()
     console.log(message, numberList)
     res.writeHead(200, { 'Content-Type': 'text/xml' });
     res.end('Hello World');
});

http.createServer(app).listen(process.env.PORT || 4000, () => {
     console.log('Express server listening on port 4000');
});
