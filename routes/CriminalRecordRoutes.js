const express = require("express")
const {
    getCrimimalRecord,
    getCrimimalRecords,
    createCrimimalRecord,
    updateCrimimalRecord,
    deleteCrimimalRecord,
    uploadCriminalRecords,
    getCrimimalRecordByPhoneNumber,
} = require("../controllers/CriminalRecordController")
const { upload } = require("../controllers/UploadController")

const criminalsRecordsRouter = express.Router()

criminalsRecordsRouter.route("/:id")
            .get(getCrimimalRecord)
            .put(updateCrimimalRecord)
            .delete(deleteCrimimalRecord)
            
criminalsRecordsRouter.route("/phone-number/:phoneNumber")
            .get(getCrimimalRecordByPhoneNumber)
            
criminalsRecordsRouter.route("/")
            .get(getCrimimalRecords)
            .post(createCrimimalRecord)

criminalsRecordsRouter.post('/upload-records',  upload.single("file"), uploadCriminalRecords);

module.exports = criminalsRecordsRouter;