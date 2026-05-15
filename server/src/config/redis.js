import { createClient } from "redis";

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
});

redisClient.on("error", (err) => {
    console.error("Redis Error:", err.message);
});

const connectToRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis connected");
    } catch (error) {
        console.error("Redis Error", error.message);
        process.exit(1);
    }
};

export { redisClient, connectToRedis };