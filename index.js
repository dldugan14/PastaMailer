require("dotenv").config();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');

const MessagingResponse = require('twilio').twiml.MessagingResponse;

const { Updated } = require('./models/updated')
const moment = require('moment')

const schedule = require('node-schedule');
const { scheduler, addToList, removeFromList } = require('./util/scheduler');
const { sendMessages } = require("./util/sms");

const mongoose = require('mongoose');
const { Logger } = require("./util/logger");
mongoose.connect('mongodb://mongodb:27017/pasta', { useNewUrlParser: true, useUnifiedTopology: true })

let STOP = false;

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
let cron = schedule.scheduleJob("0 12 * * 5", async function () {
     if(!STOP){
          const updatedData = await Updated.find();
          const lastUpdated = moment(updatedData[0].updated)

          if (moment().subtract(6, 'days').valueOf() >= lastUpdated.valueOf()) {

               Logger('TGIF sending messages')
               const { message, numberList } = await scheduler()

               sendMessages(message, numberList)

               Updated.updateOne({ updated: updatedData.updated }, { updated: moment().format() });
          } else {
               Logger(`Blocked by updated check\n    last updated ${lastUpdated.toString()}`)
          }
     } else { 
          Logger(`Cron Skipped\n    Emergancy Code - ${STOP}`) 
     };
});

app.post('/sms', (req, res) => {
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
});

app.get('/emergencystop', (req, res) => {
     STOP = true;
});

app.get('/emergencystopstatus', (req, res) => {
     res.writeHead(200, { 'Content-Type': 'text/xml' });
     res.end(`${STOP}`);
});

app.get('/test', (req, res) => {

     Logger('Test')
     res.writeHead(200, { 'Content-Type': 'text/xml' });
     res.end('hello');
});

http.createServer(app).listen(process.env.PORT || 4000, () => {
     console.log(`Express server listening on port ${process.env.PORT || 4000}`);
});
