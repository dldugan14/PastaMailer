require("dotenv").config();

import Koa from "koa";
// import SMSClient from "./sms";

import Router from "koa-router";


const app = new Koa();
const router = new Router();
console.log( process.env.APIKEY,
     process.env.SECRET,process.env.FROMNUM
     )
router.get("/test", ctx => (ctx.body = "Hello World"));

app.use(router.routes()).use(router.allowedMethods());



app.listen(process.env.PORT || 4000, () => console.log("server started"));
