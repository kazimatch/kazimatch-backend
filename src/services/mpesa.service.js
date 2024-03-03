import { config } from "../config/index.js";

export class MpesaService {
  constructor() {
    this.baseUrl = config.Mpesa.baseUrl;
  }

  /**
   * This API generates the tokens for authenticating your API calls.
   * This is the first API you will engage with within the set of APIs available because all the other APIs require authentication information from this API to work.
   *
   * @returns {Promise<String?>}
   */
  async #oauth() {
    try {
      const url = `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`;

      const basic = btoa(
        `${config.Mpesa.consumerKey}:${config.Mpesa.consumerSecret}`
      );

      const response = await fetch(url, {
        headers: {
          Authorization: `Basic ${basic}`,
        },
      });

      if (!response.ok) return null;

      return (await response.json()).access_token;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  /**
   * Make an STK push request to the Mpesa API
   *
   * @param {String} phone
   * @param {Number} amount
   *
   * @returns {Promise<Object?>}
   */
  async stk(phone, amount) {
    try {
      const token = await this.#oauth();
      if (!token) return null;

      const url = `${this.baseUrl}/mpesa/stkpush/v1/processrequest`;

      const date = new Date();
      const year = date.getFullYear();
      const month = ("0" + date.getMonth() + 1).slice(-2);
      const day = date.getDate();
      const hours = ("0" + date.getHours()).slice(-2);
      const minutes = ("0" + date.getMinutes()).slice(-2);
      const seconds = ("0" + date.getSeconds()).slice(-2);
      const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;

      const callbackUrl = `${config.App.baseUrl}/v1/subscriptions/callback`;

      console.log("Callback: ", callbackUrl);

      const data = {
        BusinessShortCode: config.Mpesa.shortCode,
        Password: btoa(
          `${config.Mpesa.shortCode}${config.Mpesa.passKey}${timestamp}`
        ),
        Timestamp: timestamp,
        TransactionType: "CustomerBuyGoodsOnline",
        Amount: amount,
        PartyA: phone,
        PartyB: config.Mpesa.shortCode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: "KaziMatch Payment",
        TransactionDesc: "KaziMatch Payment",
      };

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Phone Number: ", phone);
      console.log("Callback: ", callbackUrl);

      if (!response.ok) return null;

      return await response.json();
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
