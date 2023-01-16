const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
Routes = require('./routes/index')

var app = express();

app.engine('ejs', require('express-ejs-extend'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/public'));

app.use(bodyparser.json());

app.use(Routes);

var server = app.listen(5000, () => {
    server.timeout = 2000000;
    console.log(`Server is running on url 5000`);
});