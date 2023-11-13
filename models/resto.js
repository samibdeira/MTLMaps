const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestoSchema = new Schema({
    name: String,
    address: String,
    phoneNumber: String,
    image: String,
    email: String,
    category: String,
});

module.exports = mongoose.model('Resto', RestoSchema);


