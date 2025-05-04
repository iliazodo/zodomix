import mongoose from "mongoose";

const connectToMongoDB = async ()=> {
    try {
        mongoose.connect(process.env.MONGO_DB_URI);
        console.log("DB connected!")
    } catch (error) {
        console.log("Error in DB connection" , error.message);
    }
}

export default connectToMongoDB;