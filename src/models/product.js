import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        id: { type: String },
        name: { type: String },
        model: { type: String },
        comment: { type: String },
        userId: { type: String },
        categoryId: { type: String },
        image: { type: String },
        thumbnail: { type: String },
        stock: { type: Number },
    },
    {
        timestamps: true,
    },
);

const Product = mongoose.model('Product', productSchema);

export default Product;
