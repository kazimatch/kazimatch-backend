import { MpesaService } from "../src/services/index.js";
import test from "ava";

const mpesaService = new MpesaService();

test("Mpesa STK push", async (t) => { 
    const response = await mpesaService.stk("254714044854", 1);
    console.log(response);
    t.pass();
});