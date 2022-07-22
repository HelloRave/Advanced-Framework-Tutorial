const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on')
require('dotenv').config()

const landingRoutes = require('./routes/landing')
const productRoutes = require('./routes/products')

let app = express()

app.set('view engine', 'hbs')

app.use(express.static('public'))

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts')

app.use(express.urlencoded({
    extended: false 
}))

app.use('/',landingRoutes)

app.use('/products', productRoutes)

app.listen(3000, () => {
    console.log('Server started')
})