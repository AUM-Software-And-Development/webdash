const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const Administrator = require('../Models/Schema For Administrators')

// This is passed in from the config file
module.exports = function(passport) {
   passport.use(new GoogleStrategy( {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/authorization/google-callback"
   }, async (accessToken, refreshToken, profile, done) => {
      const requestor = {
         GoogleID: profile.id,
         FullName: profile.displayName,
         FirstName: profile.name.givenName,
         LastName: profile.name.familyName,
         ProfileImage: profile.photos[0].value
      }
      try {
         // Since the callback returned, check if the user is defined as an administrator or not
         let administrator = await Administrator.findOne({ GoogleID: requestor.GoogleID })
         if (administrator) {
            // Complete the request, passing null for the error (there was no error)
            // and the user already exists in the database
            done(null, administrator)
         }
         else {
            administrator = await Administrator.create(requestor)
            done(null, administrator)
         }
      } catch (err)
      {
         console.log(err)
      }
   }))

   passport.serializeUser((user, done) => {
      done(null, user.id)
   })

   passport.deserializeUser((id, done) => {
      Administrator.findById(id, (err, user) => done(err, user))
   })
}