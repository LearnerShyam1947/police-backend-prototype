const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
require("dotenv").config();

const app = express();
const crimeRecordsRouter = require("./routes/CrimeRecordRoutes");
const authRouter = require('./routes/AuthRoutes');

const port = parseInt(process.env.PORT) || 3000;
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('MONGO_URI environment variable is not defined');
    process.exit(1);
}

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Successfully connected to MongoDB');
    }).catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

app.route('/').get((req, res) => {
    res.send('Hello World!');
});

app.use(cors())
app.use(express.json())
app.use("/api/v1/crime-records", crimeRecordsRouter);
app.use('/api/v1/auth', authRouter);

app.listen(port, () => {
    console.log(`listening on port ${port}`);
});