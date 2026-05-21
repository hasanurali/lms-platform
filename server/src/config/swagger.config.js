import swaggerJsdoc from "swagger-jsdoc";
import { config } from "./index.js"
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "LMS API",
            version: "1.0.0",
            description: "Backend API documentation for LMS platform"
        },
        servers: [
            {
                url: `http://localhost:${config.port}/api/v1`
            }
        ],
        tags: [
            { name: "Auth" },
            { name: "Users" },

            { name: "Courses" },
            { name: "Modules" },
            { name: "Lessons" },

            { name: "Enrollments" },
            { name: "Progress" },

            { name: "Reviews" },
            { name: "Doubts" },

            { name: "Notifications" }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ],
    },

    // Path to route files
    apis: [path.join(__dirname, "../modules/**/*.route.js")],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;