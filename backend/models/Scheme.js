const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
    {
      name: String,
      start_date: Date,
      end_date: Date,
      condition_type: String
    }
);

module.exports = mongoose.model('Scheme', schemeSchema, 'SchemeDB')