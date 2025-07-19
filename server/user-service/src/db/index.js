import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            process.env.MONGODB_URI
        );
        console.log(
            `Mongo connection host ${connectionInstance.connection.host}`
        );
    } catch (err) {
        console.log("Mongo connection failed ", err);
        process.exit(1);
    }
};

export default connectDB;
