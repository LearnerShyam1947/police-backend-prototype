const multer = require('multer');
const excelToJson = require('./../utils/FileUtils');

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, 
});

const uploadFunction = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const jsonData = excelToJson(req.file.buffer);
        console.log(jsonData);
        return res.json(jsonData);
    } catch (error) {
        return res.status(500).json({ error: 'Error processing the Excel file', details: error.message });
    }
}

module.exports = {
    upload,
    uploadFunction
}
