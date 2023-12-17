"use strict";

var express = require('express');

var connectToMongo = require('./db');

var cors = require('cors');

var auth = require('./routers/auth');

var error = require('./errorHandler/errorController');

var imgRouter = require('./routers/img');

require("dotenv").config();

var bodyParser = require('body-parser');

var analyticaltool = require('./routers/analyticaltool'); // const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


connectToMongo();
var app = express();
var port = process.env.PORT;
app.use(cors());
app.use(bodyParser.json({
  limit: '500mb'
})); // app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

app.use(express.json());
app.use(error);
app.use('/images', imgRouter);
app.use('/auth', auth);
app.use('/analytic', analyticaltool);
app.listen(port, function () {
  console.log("Example app listening at http://localhost:".concat(port));
});