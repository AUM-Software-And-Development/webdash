const mongoose = require('mongoose')

const AdministratorSchema = new mongoose.Schema({
   GoogleID: {
      type: String,
      required: true
   },
   FullName: {
      type: String,
      required: true
   },
   FirstName: {
      type: String,
      required: true
   },
   LastName: {
      type: String,
      required: true
   },
   ProfileImage: {
      type: String,
   },
   CreateDate: {
      type: Date,
      default: Date.now
   },
   DashboardAministrator: {
      type: Boolean,
      default: true,
      required: true
   }
})

module.exports = mongoose.model('Administrator', AdministratorSchema)