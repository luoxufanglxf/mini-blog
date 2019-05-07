const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const Mixed    = Schema.Types.Mixed

const MessageSchema = new Schema({
  nikename: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true },
  reply: { type: String },
  meta: { type: Mixed },
  created: { type: Date }
}) 

mongoose.model('Message', MessageSchema)