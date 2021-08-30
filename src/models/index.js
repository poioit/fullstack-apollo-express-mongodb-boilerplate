import mongoose from 'mongoose';

import User from './user';
import Message from './message';
import Invoice from './invoice';
import Stock from './stock';
import Product from './product';
import Purchase from './purchase';
import Category from './category';

const connectDb = () => {
    if (process.env.TEST_DATABASE_URL) {
        return mongoose.connect(
            encodeURIComponent(process.env.TEST_DATABASE_URL),
            { useNewUrlParser: true },
        );
    }

    if (process.env.DATABASE_URL) {
        return mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
        });
    }
};

const models = {
    User,
    Message,
    Invoice,
    Stock,
    Product,
    Purchase,
    Category,
};

export { connectDb };

export default models;
