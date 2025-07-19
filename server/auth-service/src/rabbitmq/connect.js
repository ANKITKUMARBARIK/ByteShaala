import amqplib from "amqplib";
import {
    handleUserPasswordChangedEvent,
    handleUserDeletedEvent,
} from "./handlers.js";

let channel;
let connection;

export const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        // Auth Service publish auth_exchange to User Service
        await channel.assertExchange("auth_exchange", "topic", {
            durable: false,
        });
        console.log("✅ Connected to RabbitMQ (Auth Service)");

        // Auth Service consumes from user_exchange
        await channel.assertExchange("user_exchange", "topic", {
            durable: false,
        });
        const { queue } = await channel.assertQueue("auth-service-queue");

        await channel.bindQueue(
            queue,
            "user_exchange",
            "user.password.changed"
        );
        await channel.bindQueue(queue, "user_exchange", "user.deleted");

        channel.consume(queue, async (msg) => {
            try {
                const data = JSON.parse(msg.content.toString());
                const key = msg.fields.routingKey;

                if (key === "user.password.changed") {
                    await handleUserPasswordChangedEvent(data);
                } else if (key === "user.deleted") {
                    await handleUserDeletedEvent(data);
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
