import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connect = await mongoose.connect('mongodb+srv://faizanaziz69:11@cluster0.8lzigbb.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
 console.log(`DataBase Connected at ${connect.connection.host}`);
  } catch (error) {
    console.log("DataBase connection error",error);
    process.exit(1);
  }
};
export default connectDB 