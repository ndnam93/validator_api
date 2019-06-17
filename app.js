const express = require('express');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const indexRouter = require('./routes/index');
const app = express();

const connectDb = () => mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', indexRouter);

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({status: error.status, message: error.message});
});

connectDb().then(() => {
    app.listen(process.env.PORT, () =>
        console.log(`App listening on port ${process.env.PORT}!`),
    );
});

module.exports = app;
