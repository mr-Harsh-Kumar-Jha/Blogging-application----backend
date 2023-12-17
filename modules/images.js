const mongoose = require('mongoose');
const {Schema} = mongoose;

const imageSchema = new Schema({
   url:
   {
       type:  String,
       required: true
   },
   name:{
      type:String,
      required:false
   },
   type:{
      type:String,
      required:false
   }
})
module.exports = mongoose.model('images ', imageSchema);