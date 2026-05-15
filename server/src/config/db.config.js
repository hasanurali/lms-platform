import mongoose from "mongoose";
import { config } from "./index.js";

const connectToDb = async () => {
    try {

        await mongoose.connect(config.mongoUri, {
            maxPoolSize: 10,
            minPoolSize: 2,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000,
            retryWrites: true,
            readPreference: "secondaryPreferred",
        });

        console.log("MongoDb connected")

    } catch (error) {
        console.error(`MongoDb ERROR: ${error.message}`)
        process.exit(1)
    }
};

export default connectToDb;