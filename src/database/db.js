import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();


const connectDb = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("MongoDB connection succesfull");
        
    } catch(err) {
        console.log("MongoDB connection failed:", err.message);
        process.exit(1);
    }
}

export default connectDb;