// IMPORTS
require('dotenv').config()
const express = require('express');
const Handlebars = require('express-handlebars');
var cors = require('cors')

const app = express();
app.use(cors())
app.options('*', cors()) // include before other routes

 
// Public Folder and Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

// View engine setup
const hbsConfig = {
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    defaultLayout: 'defaultLayout',
    helpers:{
        equal : function(a,b){
            return (a==b) ? true : false
        },
        notEqual : function(a,b){
            return (a!=b) ? true : false
        }
    }
}
app.set('view engine', 'hbs');
app.engine('hbs', Handlebars(hbsConfig));

// ROUTES
app.use('/', require('./routes/index'));
app.use('/api', cors(), require('./routes/api'));
app.use('/users', require('./routes/users'));
app.use('/orders', require('./routes/orders'));
app.use('/uploads', require('./routes/uploads'));
app.use('/packages', require('./routes/packages'));
app.use('/webhooks', require('./routes/webhooks'));
app.use('/sandbox', require('./routes/sandbox'));

//404 Precessing
app.get('*', (req, res) => {
    res.send('err404');
});

// LISTEN
const port = process.env.HTTP_PORT || 3000;
app.listen(port,  () => {console.log("HTTP on port: " + port)})