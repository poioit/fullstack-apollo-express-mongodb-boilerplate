import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: true,
        },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    {
        timestamps: true,
    },
    {
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            get: (v) => v.toString(),
        },
        id: { type: String },
        invoiceId: { type: String },
        question: { type: String },
        answer: { type: String },
    },
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
