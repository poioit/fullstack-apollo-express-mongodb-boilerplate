import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema(
    {
        id: { type: String },
        rate: { type: Number },
        buyPlace: { type: String },
        model: { type: String },
        quantities: { type: Number },
        unitPrice: { type: Number },
        dollar: { type: Number },
        nt: { type: Number },
        shipmentFee: { type: Number },
        shareShipmentFee: { type: Number },
        totalCost: { type: Number },
        salePrice: { type: Number },
        profit: { type: Number },
        getMoneyDate: { type: Date },
        twShipmentFee: { type: Number },
        shareProfit: { type: Number },
        getShareMoneyDate: { type: Date },
        status: { type: String },
        orderNumber: { type: String },
        shipNumber: { type: String },
        comment: { type: String },
        userId: { type: String },
    },
    {
        timestamps: true,
    },
);

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
