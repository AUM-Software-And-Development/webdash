const { request } = require('express')
const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
   Task: {
      type: String,
      required: true,
   },
   Meaning: {
      type: String,
      required: true,
   },
   Visibility: {
      type: String,
      default: 'Private',
      enum: ['Private', 'Public'],
      required: true
   },
   Date: {
      type: Date,
      default: Date.now,
      required: true
   },
   Completion: {
      type: String,
      default: 'Incomplete',
      enum: ['Incomplete', 'Complete'],
      required: true
   },
   CompletionDate: {
      type: Date,
      default: null,
      required: false
   },
   Administrator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Administrator"
   }
})

module.exports = mongoose.model('Task', TaskSchema)