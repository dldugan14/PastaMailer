import dotenv from "dotenv";

dotenv.config()

import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import schedule from 'node-schedule';
import { runSchedule, tradePastas } from './util/scheduler.js';
import { smsHandler, manualText, emergencyDisable, getStopStatus} from "./util/sms.js";

import mongoose from 'mongoose';
import  Logger  from "./util/logger.js";
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

// Every Wednesday at 12pm UTC-7 "0 19 * * 3"
let thing = schedule.scheduleJob("0 19 * * 3", async () => { 
     await runSchedule();
});

app.post('/sms', smsHandler);

app.get('/emergencystop', (req, res) => {
     Logger("emergency stop activated");
     emergencyDisable()
     res.writeHead(200, { 'Content-Type': 'text/xml' });
     res.end(getStopStatus());
});

app.get('/emergencystopstatus', (req, res) => {
     res.writeHead(200, { 'Content-Type': 'text/xml' });
     res.end(getStopStatus());
});

app.post('/manual',  (req, res) => {
     manualText(req, res);
});

app.get('/test', (req, res) => {
     Logger('Test')
     res.writeHead(200, { 'Content-Type': 'text/xml' });
     res.end('hello');
});

app.post('/trade', async (req, res) => {
     let responseString;

     const { Memory } = req.body;
     let data = JSON.parse(Memory)

     const outUser = data.twilio.collected_data.trade.answers.OUT.answer;
     const inUser = data.twilio.collected_data.trade.answers.IN.answer;

     
     responseString = await tradePastas(inUser.toLowerCase(), outUser.toLowerCase());
     Logger(responseString);
   
     res.writeHead(200, { 'Content-Type': 'application/json' });
     res.end(JSON.stringify({
          "actions": [
            {
           "say": responseString
            }
          ]
        }));
});

let server = app.listen(process.env.PORT || 4000, () => {
     Logger(`Express server listening on port ${process.env.PORT || 4000}`)
     console.log(`Express server listening on port ${process.env.PORT || 4000}`);
});
