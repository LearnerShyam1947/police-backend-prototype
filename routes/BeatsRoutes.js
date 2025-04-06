const express = require("express")
const {uploadBeatsRecords, getTodaysBeats} = require("../controllers/BeatsController");
const { upload } = require("../controllers/UploadController");

const beatsRecordsRouter = express.Router()

beatsRecordsRouter.post('/upload-records',  upload.single('file'), uploadBeatsRecords);
beatsRecordsRouter.get("/", getTodaysBeats);

module.exports = beatsRecordsRouter;