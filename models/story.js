const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    img: {
        type: String, // Bu kısım yerine
        required: true // Bu şekilde
    }
});

const stories = mongoose.model('story', storySchema);
module.exports = stories;

