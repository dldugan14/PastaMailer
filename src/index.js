require("dotenv").config();

import Koa from "koa";
import Router from "koa-router";
import scheduler from './scheduler';
import sendMessages from "./sms";
const schedule = require('node-schedule');

const app = new Koa();
const router = new Router();

// Every Friday at 12pm  "0 12 * * 5"
schedule.scheduleJob("*/60 * * * * *", function () {
     const { message, numberList } = scheduler()
     console.log(message, numberList)
     // sendMessages(message, numberList)
});

router.get("/test", ctx => {
     sendMessages(message, numberList)
     return (ctx.body = "Hello World")
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(process.env.PORT || 4000, () => console.log("server started"));
