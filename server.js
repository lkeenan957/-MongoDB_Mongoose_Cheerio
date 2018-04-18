const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const mongoose = require("mongoose");

// Set port
const PORT = process.env.PORT || 3000

//Init App
const app = express();

// View engine
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// Static folder
app.use(express.static(path.join(__dirname, './public')));

//Database = Mongoose
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/mongoScrapper';
var collections = ["Articles"];

// mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


const routes = require('./routes/apiRoutes.js')

app.use("/", routes);

app.listen(PORT, function () {
    console.log("Server started on " + PORT);
});
