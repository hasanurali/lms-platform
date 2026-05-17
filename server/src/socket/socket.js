import { Server } from "socket.io";
import { config } from "../config/index.js"
import { parse } from "cookie"
import jwt from "jsonwebtoken";

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: config.clientUrl || "*",
            credentials: true
        }
    });

    // Authenticate socket connection
    io.use((socket, next) => {
        try {
            const cookies = parse(socket.handshake.headers.cookie || "");
            const accessToken = cookies.accessToken;

            if (!accessToken) {
                return next(new Error("Authentication required"));
            }

            const decoded = jwt.verify(accessToken, config.jwt.ACCESS.SECRET);

            socket.user = {
                id: decoded.id
            };

            next();
        } catch {
            next(new Error("Authentication failed"));
        }
    });

    // Handle connections
    io.on("connection", (socket) => {

        const userId = socket.user.id.toString();

        // Join private room
        socket.join(userId);

        // Join globle room
        socket.join("global");

    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO is not initialized");
    }

    return io;
}; 