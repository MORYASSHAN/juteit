
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../packages/backend/.env') });

const UserSchema = new mongoose.Schema({
    email: String,
    role: String
});
const User = mongoose.model('User', UserSchema);

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/juteit');
        const count = await User.countDocuments({});
        const users = await User.find({}, 'email role');
        console.log('User Count:', count);
        console.log('Users:', JSON.stringify(users, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
};

check();
