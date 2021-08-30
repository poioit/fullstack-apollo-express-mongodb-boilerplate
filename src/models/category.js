import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        id: { type: String },
        name: { type: String },
        photo: { type: String },
        description: { type: String },
    },
    {
        timestamps: true,
    },
);

const Category = mongoose.model('Category', categorySchema);

export default Category;
