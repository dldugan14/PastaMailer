require("dotenv").config();

import Koa from "koa";
// import reactrouter from "koa-react-router";
// import App from "./App";
// import Container from "./container";
// import SMSClient from "./sms";

// import KoaStatic from "koa-static";
// import json from "koa-json";
import Router from "koa-router";
// import fs from "fs";

const app = new Koa();
const router = new Router();

router.get("/test", ctx => (ctx.body = "Hello World"));

app.use(router.routes()).use(router.allowedMethods());

// app.use(
//   reactrouter({
//     App,
//     onError: (ctx, err) => console.log("I Have failed!!!!", ctx, err),
//     onRedirect: (ctx, redirect) => console.log("I have redirected!"),
//     onRender: ctx => ({ Container })
//   })
// );

app.listen(process.env.PORT || 4000, () => console.log("server started"));
