const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: String,
});

module.exports = mongoose.model('Expense', ExpenseSchema);
