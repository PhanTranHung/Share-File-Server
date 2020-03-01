const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const mongoose  = require('mongoose');

const config = require('./config.json');


const apiProductsRouter = require('./api/routes/products');
const apiOrdersRouter = require('./api/routes/orders');
const apiFilesRouter = require('./api/routes/files');
const apiUserRouter = require('./api/routes/users');

const json = express.json();

mongoose.connect('mongodb+srv://' + process.env.MONGO_ATLAS_USER + ':' + process.env.MONGO_ATLAS_PW + '@cluster0-wuogr.gcp.mongodb.net/test?retryWrites=true&w=majority', { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('views', path.join(__dirname, 'views'))

app.use(morgan('dev'));
app.use('/files', express.static(config.shared_folder))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
    // res.render('index');
});

app.use(json);

// Routers which shoud handle request
app.use('/products', apiProductsRouter);
app.use('/orders', apiOrdersRouter);
app.use('/files', apiFilesRouter);
app.use('/user', apiUserRouter);

app.use((req, res, next) => {
    let err = new Error('The URL ' + req.originalUrl + " not found");
    err.status = 404; 
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.err = req.app.get('env') === "development" ? err : {};

    res.status(err.status || 500);
    res.json({
        message: err.message
    });
});


module.exports = app;
