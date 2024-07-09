const express = require('express');
const router = express.Router();
const path = require('path');
const Story = require('../models/story');
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
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Max file size 5 MB
    },
    fileFilter: function (req, file, cb) {
        const allowedFileTypes = /jpeg|jpg|png/;
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedFileTypes.test(file.mimetype);

        if (mimetype && extname) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed.'));
        }
    }
});

// Story
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find();
        res.render('story', { stories });
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send(`Internal Server Error: ${error.message}`);
    }
});

router.post('/', upload.single('imgs'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        const newStory = new Story({
            img: result.secure_url,
        });
        await newStory.save();
        fs.unlinkSync(req.file.path);
        res.redirect('/story');
    } catch (error) {
        console.error('Error adding story', error);
        res.status(500).send(`Internal Server Error: ${error}`);
    }
});

module.exports = router;
