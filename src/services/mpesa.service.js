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
      const url = `https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`;

      const basic = Buffer.from(`${config.Mpesa.consumerKey}:${config.Mpesa.consumerSecret}`).toString(
        "base64"
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Basic ${basic}`
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
  async stk(phone, amount, accountId, plan) {
    try {
      const token = await this.#oauth();
      if (!token) return null;


      const date = new Date();
      const timestamp = date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);

      const callbackUrl = `https://api.kazimatch.com/v1/subscriptions/callback`;
      const url = `https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest`;

      const password = `${config.Mpesa.shortCode}${config.Mpesa.passKey}${timestamp}`;
      const encodedPassword = Buffer.from(password).toString("base64");

      const data = {
        BusinessShortCode: config.Mpesa.shortCode,
        Password: encodedPassword,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount.toString(),
        PartyA: phone,
        PartyB: config.Mpesa.shortCode,
        PhoneNumber: phone,
        CallBackURL: callbackUrl,
        AccountReference: `${accountId}-${plan}`,
        TransactionDesc: "Subscription",
      };

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return null;

      const json = await response.json();

      return json;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
