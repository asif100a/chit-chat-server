import {Server} from "http";
import app from "./app";
import "colors";
import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();

let server: Server;

const port = 5000;

const uri = process.env.MONGODB_URI;

async function main() {
    try {
        await mongoose.connect(uri || "");
        console.log("The App is successfully connected to the MongoDB".green);
        server = app.listen(port, () => {
            console.log(`The server is running on: http://localhost:${port}`.yellow.bold);
        });
    } catch (error) {
        console.error("❌ Failed to run server: ".red.bold, error);
    }
}

main();