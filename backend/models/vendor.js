const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const vendorSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlenth: 6 },
    pan_no: { type: String,},
    businesses: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Business' }]

})

vendorSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Vendor', vendorSchema)