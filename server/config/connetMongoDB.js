import mongoose from "mongoose";

async function connectDB() {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
        console.log(`MongoDB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1); // Exit process with failure
    }
}

export default connectDB;