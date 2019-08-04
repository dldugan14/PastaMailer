require("dotenv").config();
import Koa from "koa";
import SMSClient from "./sms";
import KoaStatic from "koa-static";
import json from "koa-json";
import KoaRouter from "koa-router";
import render from "koa-ejs";
import path from "path";

const app = new Koa();
const router = new KoaRouter();
const SMS = new SMSClient();

// app.use(ctx => (ctx.body = "dope shit"));

app.use(json());

// router.get("/", async ctx => {
//   await ctx.render("index");
// });

router.get("/test", ctx => (ctx.body = "test"));

app.use(router.routes()).use(router.allowedMethods());
app.use(KoaStatic("./build"));
app.listen(process.env.PORT || 4000, () => console.log("server started"));
