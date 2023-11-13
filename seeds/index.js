const mongoose = require('mongoose');
const Resto = require('../models/resto');
const restoDB = require('./restoDB');
const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/MtlMaps', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MtlMaps database!");
}).catch(error => {
    console.error("Error connecting to the database:", error);
});

const myPictureArray = fs.readdirSync(path.join(__dirname, '..', 'pictures')).filter(file =>
    /\.(jpg|jpeg|png|gif)$/i.test(file)
);

const seedsDB = async () => {
    try {
        await Resto.deleteMany({});

        for (let r of restoDB) { // Assuming restoDB is an array of restaurant objects
            const imgPath = myPictureArray.length > 0 ? `./pictures/${myPictureArray.shift()}` : null;
            const resto = new Resto({
                name: r.name,
                address: r.address,
                email: r.email,
                phoneNumber: r.phoneNumber,
                category: r.category,
                image: 'https://source.unsplash.com/collection/483251'
            });
            await resto.save();
        }
        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding the database:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedsDB();
