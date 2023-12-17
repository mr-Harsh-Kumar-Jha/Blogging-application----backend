const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require("dotenv").config();

const url =process.env.CONN_URL ;
const connectToMongo = ()=>{
   mongoose.connect(url,()=>{
      console.log("Database connected Successfully");
   })
}
module.exports = connectToMongo;