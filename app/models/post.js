const mongoose = require('mongoose')
const Schema   = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const Mixed    = Schema.Types.Mixed

const PostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true },
  imgsrc: { type: String },
  category: { type: ObjectId, ref:'Category' },
  author: { type: ObjectId, ref:'User' },
  published: { type: Boolean, default: false },
  meta: { type: Mixed, required: true },
  comments: [ Mixed ],
  created: { type: Date }
})

mongoose.model('Post', PostSchema)