const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');

const config = require('./config.json');

const apiFilesRouter = require('./api/routes/files');

app.set('views', path.join(__dirname, 'views'))

app.use(morgan('dev'));
app.use('/files', express.static(config.shared_folder))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "views/index.html"));
    // res.render('index');
});


// Routers which shoud handle request
app.use('/files', apiFilesRouter);

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
