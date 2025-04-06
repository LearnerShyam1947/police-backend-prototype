const express = require("express")
const {
    upload,
    uploadFunction
} = require("../controllers/UploadController")

const uploadRouter = express.Router()

uploadRouter.post('/',  upload.single('file'), uploadFunction);

module.exports = uploadRouter;
