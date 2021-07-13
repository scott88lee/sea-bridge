// IMPORTS
const express = require('express');
const handlebars = require('express-handlebars');
const db = require('./config/db');

const app = express();
 
// Public Folder and Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


// View engine setup
const hbsConfig = {
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'defaultLayout',
}
app.set('view engine', 'hbs');
app.engine('hbs', handlebars(hbsConfig));

// ROUTES
app.use('/', require('./routes/index'));
// app.use('/products', require('./routes/products'));
// app.use('/purchases', require('./routes/purchases'));
// app.use('/sales', require('./routes/sales'));
// app.use('/reports', require('./routes/reports'));

//404 Precessing
app.get('*', (req, res) => {
    res.send('err404');
});

// LISTEN
const port = process.env.PORT || 3000;
app.listen(port, () => {console.log("HTTP on port: " + port) });