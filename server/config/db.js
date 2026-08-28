import mongoose from "mongoose";

const connectDB = async () => {
      try {
         const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
           serverSelectionTimeoutMS: 5000,
         });
         console.log(`MongoDB Connected !! ${connectionInstance.connection.host}`)
      } catch (error) {
        console.log(error); 
      }
}

export default connectDB;