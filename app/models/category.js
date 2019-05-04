// Category model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  title: { type: String, required: true, }, //必须的
  slug: { type: String, required: true, },
  created: {type: Date}
});

mongoose.model('Category', CategorySchema);

