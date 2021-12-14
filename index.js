require("dotenv").config();

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const { runSchedule } = require('./util/scheduler');
const { smsHandler, manualText, emergencyDisable, getStopStatus} = require("./util/sms");

const mongoose = require('mongoose');
const { Logger } = require("./util/logger");
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

app.post('/manual', manualText);

app.get('/test', (req, res) => {
     Logger('Test')
     res.writeHead(200, { 'Content-Type': 'text/xml' });
     res.end('hello');
});

app.post('/test', (req, res) => {
     Logger('Test')
     res.writeHead(200, { 'Content-Type': 'text/xml' });
     res.end('hello');
});

let server = app.listen(process.env.PORT || 4000, () => {
     Logger(`Express server listening on port ${process.env.PORT || 4000}`)
     console.log(`Express server listening on port ${process.env.PORT || 4000}`);
});
