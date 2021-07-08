const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const businessSchema = new Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    suitable: [{ type: String, required: true }],
    tags: [{ type: String, required: true }],
    owner: { type: mongoose.Types.ObjectId, required: true, ref: 'Vendor' }
})

businessSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Business', businessSchema)