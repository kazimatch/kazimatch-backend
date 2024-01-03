import { database } from "../src/config/index.js";
import test from "ava"

test("Database connection", async (t) => {
    const db = await database.connect()
    if (!db) t.fail("Database connection failed")
    db.close()
    t.pass("Database connection success")
})