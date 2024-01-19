import express from "express";
import cors from "cors";
import morgan from "morgan";
import chalk from "chalk";

import { config, database } from "./config/index.js";
import router from "./routes/index.js";
import { QueueService } from "./services/index.js";
import { Server } from "socket.io";
import { RealtimeService } from "./services/index.js";

const init = async () => {
    var db;
    try {
        db = await database.connect().then(async (db) => await db?.sync());
        if (!db) return;

        QueueService.init();

        const app = express();
        app.use(cors())
            .use(express.json())
            .use(express.urlencoded({ extended: true }))

        config.ENV === 'development' ? app.use(morgan('dev')) : null;
        app.use(`/api/${config.VERSION}`, router);

        const server = app.listen(config.PORT, () => {
            console.log("Server running on PORT", config.PORT)
        })

        const io = new Server(server, {
            cors: {
                origin: '*',
            },
            connectionStateRecovery: {
                maxDisconnectionDuration: 2 * 60 * 1000,
                skipMiddlewares: true,
            },
            
        });

        new RealtimeService(io);

    } catch (err) {
        console.log(chalk.red("Error on init", err))
        await db.close();
    }
}

init();