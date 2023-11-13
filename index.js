const mongoose = require('mongoose');
const express = require('express');
const path = require('path');
const app = express();
const Resto = require('./models/resto');
const methodOverride = require('method-override');
const morgan = require('morgan');
const ejsMate = require('ejs-mate')
const catchAsync = require('./utilities/catchAsync')


mongoose.connect('mongodb://localhost:27017/MtlMaps');

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// app.use(morgan('dev'));
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
})

app.get('/restaurants', async (req, res) => {
    const restos = await Resto.find({});
    res.render('restaurants/index', { restos });
})
app.get('/', async (req, res) => {
    const restos = await Resto.find({});
    res.render('restaurants/home', { restos });
})
app.get('/restaurants/new', (req, res) => {
    res.render('restaurants/new');
})
// app.post('/restaurants', async (req, res, next) => {
//     const restaurant = new Resto(req.body.restaurant);
//     const savedRestaurant = await restaurant.save();
//     res.redirect(`/restaurants/${savedRestaurant._id}`);
// });

app.post('/restaurants', async (req, res, next) => {
    try {
        // Basic validation (you can expand on this as per your requirements)
        if (!req.body.restaurant || !req.body.restaurant.name) {
            throw new Error('Invalid restaurant data');
        }

        // Create a new restaurant instance from the request body
        const restaurant = new Resto(req.body.restaurant);

        // Save the new restaurant to the database
        const savedRestaurant = await restaurant.save();

        // Redirect to the show page of the newly created restaurant
        res.redirect(`/restaurants/${savedRestaurant._id}`);
    } catch (error) {
        // Log the error for debugging
        console.error('Error creating a new restaurant:', error);

        // Pass the error to the next error handling middleware
        next(error);
    }
});

app.get('/restaurants/:id/edit', async (req, res) => {
    const { id } = req.params;
    const restaurant = await Resto.findById(id);
    res.render('restaurants/edit', { restaurant });
})
app.get('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const restaurant = await Resto.findById(id);
    // console.log("Fetched restaurant:", restaurant);
    res.render('restaurants/show', { restaurant });
});
app.put('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const restaurant = await Resto.findByIdAndUpdate(id, { ...req.body.restaurant });
    res.redirect(`/restaurants/${restaurant._id}`);
})


app.delete('/restaurants/:id', async (req, res) => {
    const { id } = req.params;
    const restaurant = await Resto.findByIdAndDelete(id);
    res.redirect('/restaurants');
})

app.use((err, req, res, next) => {
    res.send('OH NO ');
})

app.listen('3000', () => {
    console.log('Listening on 3000');
})
