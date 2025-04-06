const express = require("express")
const {
    upload,
    uploadFile,
    getCrimeRecord,
    getCrimeRecords,
    createCrimeRecord,
    updateCrimeRecord,
    deleteCrimeRecord
} = require("../controllers/CrimeRecordController")

const crimeRecordsRouter = express.Router()

crimeRecordsRouter.route("/:id")
            .get(getCrimeRecord)
            .put(updateCrimeRecord)
            .delete(deleteCrimeRecord)

crimeRecordsRouter.route("/")
            .get(getCrimeRecords)
            .post(createCrimeRecord)

crimeRecordsRouter.post('/upload-file',  upload.single('file'), uploadFile);

module.exports = crimeRecordsRouter;