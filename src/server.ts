import 'dotenv/config';
import * as http from "http";
import app from "./app/app";
import {establishDatabaseConnection} from "./app/databases/sql-connection";

establishDatabaseConnection()
    .then(() => {
        startServer();
    }).catch((error: any) => {
    console.error("Could not start Application due to", error);
    process.exit(-1);
})

const startServer = () => {
    const PORT: number = process.env.APP_PORT ? +process.env.APP_PORT : 4000;

    http.createServer(app).listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
};


