// Post model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId,
    Mixed    = Schema.Types.Mixed

var PostSchema = new Schema({
  title: { type: String, required: true, }, //必须的
  content: { type: String, required: true, },
  slug: { type: String, required: true, },
  imgsrc: { type: String},
  category: { type: ObjectId, ref:'Category'},
  author: { type: ObjectId, ref:'User'},
  published: { type: Boolean, default: false, },
  meta: { type: Mixed, required: true, },
  comments: [ Mixed ],
  created: {type: Date}
});

mongoose.model('Post', PostSchema);

