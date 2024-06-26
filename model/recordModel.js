const mongoose = require("mongoose");
const user = require('./userModel');

// const recordSchema = mongoose.Schema({
//     name : String,
//    pupilClass : String,
//     totalAmount: Number,
//   depositedAmount: Number,
//   balanceAmount: Number
// })

const recordSchema = mongoose.Schema({
  userId : {
    type : mongoose.Schema.Types.ObjectId,
    require: true,
    ref : user
},
  className: String,
  studentName: String,
  amountToBePaid: Number,
  amountDeposited: Number,
  balanceAmount: Number
});

// recordSchema.virtual('balance').get(function() {
//   return this.amountToBePaid - this.amountDeposited;
// });
recordSchema.pre('save', function(next) {
  this.balanceAmount = this.amountToBePaid - this.amountDeposited;
  next();
});


const recordModel = mongoose.model('Record', recordSchema);
module.exports = recordModel;