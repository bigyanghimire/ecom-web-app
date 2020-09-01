
const PORT = process.env.PORT || 3001;

const fs = require("fs");
const path = require('path');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
var Cart = require('./models/cart');
app.set('views', path.join(__dirname, 'public'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


var seedroute = require('./router');
app.use('/sr', seedroute);

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});

