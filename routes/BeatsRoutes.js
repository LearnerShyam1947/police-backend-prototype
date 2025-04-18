const express = require("express")
const { 
    uploadBeatsRecords, 
    getTodaysBeats, 
    updateBeatStatus,
    getTodaysUnMapBeats,
    updateBeatPoliceStation
} = require("../controllers/BeatsController");
const { upload } = require("../controllers/UploadController");

const beatsRecordsRouter = express.Router()

beatsRecordsRouter.post('/upload-records',  upload.single('file'), uploadBeatsRecords);
beatsRecordsRouter.put("/:id/update-status", updateBeatStatus);
beatsRecordsRouter.get("/", getTodaysBeats);

beatsRecordsRouter.get("/un-mapped", getTodaysUnMapBeats);
beatsRecordsRouter.put("/:id/update-station", updateBeatPoliceStation);

module.exports = beatsRecordsRouter;
