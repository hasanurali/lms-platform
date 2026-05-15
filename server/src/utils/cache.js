import { redisClient } from "../config/redis.js";

export const getCache = async (key) => {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
};

export const setCache = async (key, value, ttl = 300) => {
    await redisClient.setEx(key, ttl, JSON.stringify(value));
};

export const deleteCache = async (key) => {
    await redisClient.del(key);
};

export const deleteCacheByPattern = async (pattern) => {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
        await redisClient.del(keys);
    }
};