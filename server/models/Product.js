const mongoose = require("mongoose");
const { PRODUCT_CATEGORIES } = require("../utils/productCategory");

const productSchema = new mongoose.Schema(
    {
        name: String,
        price: Number,
        oldPrice: Number,
        bv: Number,
        stock: Number,
        image: String,
        images: {
            type: [String],
            default: [],
        },
        description: String,
        // Category whitelist for product documents
        category: {
            type: String,
            required: true,
            enum: PRODUCT_CATEGORIES
        },
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        paymentMethods: {
            type: [String],
            enum: ['cod', 'upi', 'card'],
            default: ['cod', 'upi', 'card']
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
