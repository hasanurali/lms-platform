import mongoose from "mongoose";
import { config } from "./index.js";

const connectToDb = async () => {
    try {

        await mongoose.connect(config.mongoUri, {
            maxPoolSize: 10,
        })

        console.log("MongoDb connected")

    } catch (error) {
        console.error(`MongoDb ERROR: ${error.message}`)
        process.exit(1)
    }
};

export default connectToDb;