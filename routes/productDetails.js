const express = require('express');
const router = express.Router();
const Product = require('../models/db');

router.get('/addProduct', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('addProduct', { products });
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error ${error}`);
    }
});

// Route to fetch product details by ID
router.get('/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const product = await Product.findById(productId);
        const products = await Product.find();
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.render('productDetails', { product, products });
    } catch (error) {
        console.log(`Error fetching product: ${error.message}`);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
