const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    img: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
