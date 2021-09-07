const path = require('path')
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const connectDB = require('./Models/Database Configuration')
const passport = require('passport')
const session = require("express-session")
const MongoStore = require("connect-mongo")
const mongoose = require("mongoose")

// Load config
dotenv.config( { path: './Configuration/Configuration.env' } )

connectDB()

require('./Administration/Passport')(passport)

const app = express()

// Object body parser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

if (process.env.NODE_ENV === 'development'){
   app.use(morgan('dev'))
}

// Authenticator
app.use(session({
   secret: process.env.APP_SECRET,
   resave: false,
   saveUninitialized: false,
   store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI
   })
}))
app.use(passport.initialize())
app.use(passport.session())

// Handlebars (set render objectives)
app.engine('.hbs', exphbs({defaultLayout: 'Base-Template', extname: '.hbs'}));
app.set('view engine', '.hbs');

// Static folder (Just used to ignore path)
app.use( express.static( path.join( __dirname, 'Static' ) ) )

// Routes (uses vies folder as well)
app.use( '/', require('./Application Routes/Routes') )

// If not running on port from config, use 3000
const PORT = process.env.PORT || 3000

app.listen( PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`) )