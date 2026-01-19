import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI).then(() => {
            console.log("MongoDB connected successfully");
        });
    } catch (error) {
        console.log("MongoDB connection failed");
        console.error(error);
    }

}

export default connectDB;