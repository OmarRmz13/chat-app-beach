const mongoose = require("mongoose");
const User = require('./user')
let Schema = mongoose.Schema;

let convertationSchema = new Schema({
  user1:{
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  user2:{
    type: Schema.Types.ObjectId,
    ref:'User'
  },
  messages: {
    type: Array,
    required: false,
    default:[]
  },
  favorites:{
    type:Array,
    default:[],
    required:false
  }
});

module.exports = mongoose.model("Convertation", convertationSchema);
