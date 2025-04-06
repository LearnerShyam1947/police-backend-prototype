const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const uploadRouter = require('./routes/UploadRoute');
const criminalsRecordsRouter = require('./routes/CriminalRecordRoutes');
const beatsRecordsRouter = require('./routes/BeatsRoutes');

require("dotenv").config();

const app = express();

const port = process.env.PORT || 5000;
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
    
app.use(cors());
app.use("/xlsx-to-json", uploadRouter);
app.use("/api/v1/beats", beatsRecordsRouter);
app.use("/api/v1/criminals", criminalsRecordsRouter);

app.route('/').get((req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
