const express = require('express');
const connectToMongo = require('./db')
const cors = require('cors');
const auth = require('./routers/auth');
const error = require('./errorHandler/errorController');
const imgRouter = require('./routers/img')
require("dotenv").config();
const bodyParser = require('body-parser');
const analyticaltool = require('./routers/analyticaltool');
const blogRouter = require('./routers/blog');
const commentRouter = require('./routers/comment');

// const __filename = fileURLToPath(import.meta.url);

// const __dirname = path.dirname(__filename);

connectToMongo();
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json({limit: '500mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

app.use(express.json());
app.use('./uploads', express.static('uploads'));
app.use(error);

app.use('/images',imgRouter);
app.use('/auth',auth);
app.use('/analytic', analyticaltool);
app.use('/upload', blogRouter);
app.use('/comment', commentRouter);

app.listen(port, () => {
   console.log(`Example app listening at http://localhost:${port}`);
 })