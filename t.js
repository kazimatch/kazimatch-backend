import { MpesaService } from "./src/services/index.js";

const mpesaService = new MpesaService();

mpesaService.stk("254714044854", 1).then((response) => {
    console.log(response);
})