import amqplib from "amqplib";
import {
    handleSignupMailEvent,
    handleWelcomeMailEvent,
    handleTokenMailEvent,
} from "./handlers.js";

let channel;
let connection;

export const connectRabbitMQ = async () => {
    try {
        connection = await amqplib.connect(process.env.RABBITMQ_URL);
        channel = await connection.createChannel();

        // Notification Service publish notification_exchange to Other Service
        await channel.assertExchange("notification_exchange", "topic", {
            durable: false,
        });
        console.log("✅ Connected to RabbitMQ (Notification Service)");

        // Notification Service consumes from auth_exchange, captain_exchange
        await channel.assertExchange("auth_exchange", "topic", {
            durable: false,
        });

        const { queue: authQueue } = await channel.assertQueue(
            "notification-auth-queue"
        );

        await channel.bindQueue(
            authQueue,
            "auth_exchange",
            "verify.signup.mail"
        );
        await channel.bindQueue(
            authQueue,
            "auth_exchange",
            "welcome.signup.mail"
        );
        await channel.bindQueue(
            authQueue,
            "auth_exchange",
            "verify.token.mail"
        );

        channel.consume(authQueue, async (msg) => {
            try {
                const data = JSON.parse(msg.content.toString());
                const key = msg.fields.routingKey;

                if (key === "verify.signup.mail") {
                    await handleSignupMailEvent(data);
                } else if (key === "welcome.signup.mail") {
                    await handleWelcomeMailEvent(data);
                } else if (key === "verify.token.mail") {
                    await handleTokenMailEvent(data);
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
