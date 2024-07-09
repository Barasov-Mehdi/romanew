const bodyParser = require('body-parser');
const express = require('express');
require('dotenv').config();
const path = require('path');
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const Product = require('./models/db');
const Story = require('./models/story'); // Use 'Story' instead of 'stories' here for clarity
const app = express();

let intervalId; // setInterval fonksiyonunun dönüş değerini saklamak için bir değişken

function startClearingStories() {
    intervalId = setInterval(async () => {
        try {
            await Story.deleteMany({});
            console.log('Tüm hikayeler silindi.');
            clearInterval(intervalId); // Hikayeler silindikten sonra setInterval'ı durdur
        } catch (error) {
            console.error('Hikayeleri silerken hata oluştu:', error);
        }
    }, 86400);
}
startClearingStories();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
 
const PORT = process.env.PORT || 5000;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'sasFile')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const homeRouter = require('./routes/home');
const addProductRouter = require('./routes/addProduct');
const productDetailsRouter = require('./routes/productDetails');
const storyRouter = require('./routes/story');
app.use('/home', homeRouter);
app.use('/addProduct', addProductRouter);
app.use('/productDetails', productDetailsRouter);
app.use('/story', storyRouter);
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};
connectDB();

app.get('/', async (req, res) => {
    try {
        const stories = await Story.find(); // Burada stories değişkenini doğru şekilde tanımlayın
        const products = await Product.find();
        res.render('home', { stories, products }); // 'stories' değişkenini küçük harfle gönderin
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send('Server Error');
    }
});

app.get('/story', async (req, res) => {
    res.render('story');
});

app.get('/remove', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('remove', { products });
    } catch (error) {
        console.log(error);
        res.status(500).send(`Error ${error}`);
    }
});

app.post('/remove', async (req, res) => {
    try {
        const { productId } = req.body;
        await Product.findByIdAndDelete(productId);
        res.redirect('/remove');
    } catch (error) {
        console.error('Error removing product', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/addProduct', async (req, res) => {
    res.render('addProduct');
});

// Ürün ekleme formunu göster
app.get('/productDetails', (req, res) => {
    res.render('productDetails');
});

// Kategoriye göre filtreleme
app.get('/category/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const products = await Product.find({ category });
        res.render('home', { products });
    } catch (error) {
        console.log(`Error: ${error}`);
        res.status(500).send('Server Error');
    }
});

// Ürünleri getiren endpoint
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        console.error('Ürünler alınırken hata oluştu:', error);
        res.status(500).send('İç sunucu hatası');
    }
});

// Kategoriye göre ürünleri getiren endpoint
app.get('/api/category/:categoryName', async (req, res) => {
    const categoryName = req.params.categoryName;
    try {
        const products = await Product.find({ category: categoryName });
        res.json(products);
    } catch (error) {
        console.error('Kategoriye göre ürünler alınırken hata oluştu:', error);
        res.status(500).send('İç sunucu hatası');
    }
});


app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});
