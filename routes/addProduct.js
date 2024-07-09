const express = require('express');
const router = express.Router();
const path = require('path');
const Products = require('../models/db');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Multer setup for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Define the destination folder for the uploaded files
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname); // Get the extension of the file
        const randomName = Date.now() + '-' + Math.round(Math.random() * 1000) + ext; // Generate a random name for the file
        cb(null, randomName); // Set the filename for the uploaded file
    }
});
const upload = multer({ storage: storage });

router.get('/', (req, res) => {
    res.render('addProduct');
});

router.post('/', upload.single('img'), async (req, res) => {
    try {
        const { productName, size, category } = req.body;
        const result = await cloudinary.uploader.upload(req.file.path);
        const newProduct = new Products({
            img: result.secure_url,
            productName,
            size,
            category
        });
        await newProduct.save();
        fs.unlinkSync(req.file.path);
        res.redirect('/addProduct');
    } catch (error) {
        console.error('Error adding product', error);
        res.status(500).send(`Internal Server Error: ${error}`);
    }
});

// Silme
router.get('/remove', async (req, res) => {
    res.render('remove');
});

router.post('/remove', async (req, res) => {
    try {
        const { productId } = req.body;
        await Products.findByIdAndDelete(productId);
        res.redirect('/remove');
    } catch (error) {
        console.error('Error removing product', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
