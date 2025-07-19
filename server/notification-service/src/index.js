import dotenv from "dotenv";
import app from "./app.js";
import { connectRabbitMQ } from "./rabbitmq/connect.js";

dotenv.config({ path: "./.env" });

const startServer = async () => {
    try {
        await connectRabbitMQ();

        app.listen(process.env.PORT || 5005, () => {
            console.log(`🚀 API Gateway running on port ${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Server error:", error.message);
        process.exit(1);
    }
};

startServer();
