import Nexmo from "nexmo";

export default class SMSClient {
  constructor() {
    this.Nexmo = new Nexmo({
      apiKey: process.env.APIKEY,
      apiSecret: process.env.SECRET
    });

    this.sendMessage = this.sendMessage.bind(this);
  }

  sendMessage(text, toNum) {
    this.Nexmo.message.sendSms(process.env.FROMNUM, toNum, text);
  }
}
