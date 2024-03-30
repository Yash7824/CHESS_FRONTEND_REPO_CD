import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.DATABASE;

const connectToMongo = async () => {
    try {
        mongoose.set('strictQuery', true)
        await mongoose.connect(mongoURI ? mongoURI : '');
        console.log('Mongoose DB connected');
    }
    catch (error: any) {
        console.log(error.message);
        process.exit(1);
    }
}

export default connectToMongo;
