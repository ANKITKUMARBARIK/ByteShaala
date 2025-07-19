import amqplib from "amqplib";
import {
    handleAuthAccountCreate,
    handlePasswordChangeResponse,
} from "./handlers.js";

let channel;
let connection;

export const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        // User Service publish user_exchange to Auth Service
        await channel.assertExchange("user_exchange", "topic", {
            durable: false,
        });
        console.log("✅ Connected to RabbitMQ (User Service)");

        // User Service consumes from auth_exchange
        await channel.assertExchange("auth_exchange", "topic", {
            durable: false,
        });
        const { queue } = await channel.assertQueue("user-service-queue");

        await channel.bindQueue(queue, "auth_exchange", "auth.account.create");
        await channel.bindQueue(
            queue,
            "auth_exchange",
            "auth.password.changed.success"
        );
        await channel.bindQueue(
            queue,
            "auth_exchange",
            "auth.password.changed.failed"
        );

        channel.consume(queue, async (msg) => {
            try {
                const data = JSON.parse(msg.content.toString());
                const key = msg.fields.routingKey;

                if (key === "auth.account.create") {
                    await handleAuthAccountCreate(data);
                } else if (key === "auth.password.changed.success") {
                    await handlePasswordChangeResponse(data, key);
                } else if (key === "auth.password.changed.failed") {
                    await handlePasswordChangeResponse(data, key);
                } else {
                    console.log("⚠️ Unknown routing key:", key);
                }

                channel.ack(msg);
            } catch (err) {
                console.error("❌ Message handling error:", err.message);
                channel.ack(msg);
            }
        });

        // Graceful shutdown
        process.on("SIGINT", async () => {
            await channel.close();
            await connection.close();
            console.log("❌ RabbitMQ connection closed gracefully");
            process.exit(0);
        });
    } catch (err) {
        console.error("❌ RabbitMQ Connection Error:", err.message);
    }
};

export const getChannel = () => channel;
