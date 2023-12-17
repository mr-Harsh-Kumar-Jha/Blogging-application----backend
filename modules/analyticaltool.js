const mongoose = require('mongoose');
const {Schema} = mongoose;

const analytic = new Schema({
   active: {
      user_id: [],
   },
   previousActive:{
      user_id: [],
   },
   totalActive:{
      type:Number,
   }
})

module.exports = mongoose.model('analytic', analytic);