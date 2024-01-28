import { MpesaService } from "../src/services/index.js";
import test from "ava";

const mpesaService = new MpesaService();

test("Mpesa STK push", async (t) => {
    const response = await mpesaService.stk("254714044854", 1);
    if (response.ResponseCode === "0") {
        t.pass("Mpesa STK push success");
    } else {
        t.fail(`Mpesa STK push failed: ${ResponseDescription}`);
    }
});