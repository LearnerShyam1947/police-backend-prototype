const CrimeRecordModel = require("../models/CrimeRecordModel");
const mongoose  = require("mongoose");
const multer = require('multer');
const xlsx = require('xlsx');

const getCrimeRecords = async (req, res) => {
    try {
        const crimeRecords = await CrimeRecordModel.find({});
        res.status(200).json(crimeRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCrimeRecord = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Crime Record ID format' });
        }

        const crimeRecord = await CrimeRecordModel.findById(id);
        if(!crimeRecord)
            res.status(404).json({ error: "Crime record not found." })

        res.status(200).json(crimeRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createCrimeRecord = async (req, res) => {
    try {
        const crimeRecord = await CrimeRecordModel.create(req.body);
        res.status(200).json(crimeRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCrimeRecord = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Crime Record ID format' });
        }

        const crimeRecord = await CrimeRecordModel.findByIdAndUpdate(id, req.body);

        if (!crimeRecord) {
            return res.status(404).json({ error: "Crime Record not found" });
        }

        const updatedCrimeRecord = await CrimeRecordModel.findById(id);
        res.status(200).json({
            message: 'CrimeRecord updated successfully',
            CrimeRecord: updatedCrimeRecord
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCrimeRecord = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Crime Record ID format' });
        }

        const crimeRecord = await CrimeRecordModel.findByIdAndDelete(id);

        if (!crimeRecord) {
            return res.status(404).json({ error: "Crime Record not found" });
        }

        res.status(200).json({ message: "Crime Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Parse the Excel file using xlsx
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        // Convert the sheet data to JSON
        const jsonData = xlsx.utils.sheet_to_json(sheet);
        
        // Insert data into MongoDB
        const records = await CrimeRecordModel.insertMany(jsonData);

        res.status(200).json({
            message: `${records.length} records successfully inserted into the database`,
            records: records
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the file' });
    }
}


module.exports = {
    upload,
    uploadFile,
    getCrimeRecord,
    getCrimeRecords,
    createCrimeRecord,
    updateCrimeRecord,
    deleteCrimeRecord,
}