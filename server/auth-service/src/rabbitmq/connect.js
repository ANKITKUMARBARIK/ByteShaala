import amqplib from "amqplib";

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
