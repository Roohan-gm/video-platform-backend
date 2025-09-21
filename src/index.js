import dotenv from "dotenv";
import connectToDatabase from "./database/index.js";
dotenv.config({
    path: "./env"
});


connectToDatabase();