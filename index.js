// IMPORTS
require('dotenv').config()
const express = require('express');
const Handlebars = require('express-handlebars');

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "../temp"); // here we specify the destination . in this case i specified the current directory
  },
  filename: function(req, file, cb) {
    console.log(file);
    cb(null, file.originalname);// here we specify the file saving name . in this case i specified the original file name
  }
});

const uploadDisk = multer({ storage: storage });

const app = express();
 
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
app.post("/fileupload", uploadDisk.single("image"), (req, res) => {
    console.log(" file disk uploaded");
    res.send("file disk upload success");
  });

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/orders', require('./routes/orders'));
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