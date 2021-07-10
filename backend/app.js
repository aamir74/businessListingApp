const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const HttpError = require('./models/http-error')


const vendorsRoutes = require('./routes/vendors-routes')
const businessesRoutes = require('./routes/businesses-routes')
const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-type, Accept, Authorization'
    )
    res.setHeader('Access-Control-Allow-Methods', 'get, post, patch, delete')
    next()
})

app.use(bodyParser.json())

app.use('/api/vendors', vendorsRoutes)
app.use('/api/businesses',businessesRoutes)


app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404)
    throw error.message
})


mongoose
  .connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.st5bw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, { useNewUrlParser: true })    .then(() => {
        app.listen(5000)
    })
    .catch(err => {
        console.log(err)
    })
