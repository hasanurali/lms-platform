import dns from "dns";
dns.setDefaultResultOrder('ipv4first');
import app from "./app.js";
import { config } from "./config/index.js";
import connectToDb from "./config/db.config.js";
import { connectToCloudinary } from "./config/cloudinary.config.js";
import { connectToRedis } from "./config/redis.js"
import http from "http"
import { initializeSocket } from "./socket/socket.js";

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);


(async () => {
    try {

        await connectToDb();

        await connectToRedis()

        await connectToCloudinary();

        server.listen(config.port, () => {
            console.log(`Server running on http://localhost:${config.port}`);
        });

    } catch (error) {
        console.error(`Server startup failed: ${error.message}`);
        process.exit(1);
    }
})();
