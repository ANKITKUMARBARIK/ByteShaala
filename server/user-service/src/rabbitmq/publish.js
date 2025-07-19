import { getChannel } from "./connect.js";

const publishMessage = async (exchangeName, routingKey, data = {}) => {
    try {
        const channel = getChannel();
        if (!channel) {
            console.error("❌ Cannot publish, channel is not initialized");
            return;
        }

        const bufferData = Buffer.from(JSON.stringify(data));

        channel.publish(exchangeName, routingKey, bufferData);
        console.log(`📤 Message Published → [${exchangeName}] ${routingKey}`);
    } catch (error) {
        console.error("❌ Failed to publish message:", error.message);
    }
};

export default publishMessage;
