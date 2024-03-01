const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: String,
    description: String,
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // Reference to courses collection

  });
  
module.exports = mongoose.model('Category', categorySchema);
