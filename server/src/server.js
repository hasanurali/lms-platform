import app from "./app.js";
import { config } from "./config/index.js";
import connectToDb from "./config/db.config.js";
import { connectToCloudinary } from "./config/cloudinary.config.js";

(async () => {
    try {

        await connectToDb();

        await connectToCloudinary();

        app.listen(config.port, () => {
            console.log(`Server running on http://localhost:${config.port}`);
        });

    } catch (error) {
        console.error(`Server startup failed: ${error.message}`);
        process.exit(1);
    }
})();