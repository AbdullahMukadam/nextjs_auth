// database/ConnectToDb.js
import mongoose from 'mongoose';

const ConnectToDb = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return true;
        }
        
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
        return true;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export default ConnectToDb;