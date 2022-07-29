const express = require('express')
const hbs = require('hbs')
const wax = require('wax-on')
const session = require('express-session')
const flash = require('connect-flash')
const FileStore = require('session-file-store')(session)
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

app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(flash())

app.use(function(req,res,next){
    res.locals.success_messages = req.flash('success_messages')
    res.locals.error_messages = req.flash('error_messages')
    next()
})

app.use('/',landingRoutes)

app.use('/products', productRoutes)

app.listen(3000, () => {
    console.log('Server started')
})