const CrimimalRecordModel = require("../models/CriminalModel");
const mongoose = require("mongoose");
const excelToJson = require("../utils/FileUtils");

const getCrimimalRecords = async (req, res) => {
    try {
        const crimimalRecords = await CrimimalRecordModel.find({});
        res.status(200).json({
            noOfRecords: `${crimimalRecords.length}`,
            records: crimimalRecords
        });
        // res.status(200).json(crimimalRecords);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCrimimalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid Crimimal Record ID format' });
        }

        const crimimalRecord = await CrimimalRecordModel.findById(id);
        if (!crimimalRecord)
            res.status(404).json({ error: "Crimimal record not found." })

        res.status(200).json(crimimalRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCrimimalRecordByPhoneNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.params;

        // Use findOne to get just the first matching record
        const crimimalRecord = await CrimimalRecordModel.findOne({ mobileNumber: phoneNumber });

        if (!crimimalRecord) {
            return res.status(404).json({ error: "Crimimal record not found." });
        }

        res.status(200).json(crimimalRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createCrimimalRecord = async (req, res) => {
    try {
        const crimimalRecord = await CrimimalRecordModel.create(req.body);
        res.status(200).json(crimimalRecord);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateCrimimalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Crimimal Record ID format' });
        }

        const crimimalRecord = await CrimimalRecordModel.findByIdAndUpdate(id, req.body);

        if (!crimimalRecord) {
            return res.status(404).json({ error: "Crimimal Record not found" });
        }

        const updatedCrimimalRecord = await CrimimalRecordModel.findById(id);
        res.status(200).json({
            message: 'CrimimalRecord updated successfully',
            CrimimalRecord: updatedCrimimalRecord
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteCrimimalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid Crimimal Record ID format' });
        }

        const crimimalRecord = await CrimimalRecordModel.findByIdAndDelete(id);

        if (!crimimalRecord) {
            return res.status(404).json({ error: "Crimimal Record not found" });
        }

        res.status(200).json({ message: "Crimimal Record deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const uploadCriminalRecords = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const jsonData = excelToJson(req.file.buffer);
        const formattedRecords = jsonData.map(mapCriminalData);

        // Insert data into MongoDB
        const records = await CrimimalRecordModel.insertMany(formattedRecords);

        res.status(201).json({
            message: `${records.length} records successfully inserted into the database`,
            records: records
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the file' });
    }
}

function mapCriminalData(data) {
    let [namePart, addressPart] = data['Accused Name'].split('Address:');

    return {
        policeStation: data.PS,
        FirNo: data['FIR No.'],
        actsAndSections: data['Acts & Sections'],
        accusedName: namePart?.trim() || '',
        address: addressPart?.trim() || '',
        age: data.Age,
        gender: data.Gender,
        firDate: safeParseDate(data['FIR Date']),
        arrestDate: safeParseDate(data['Arrest Date']),
        mobileNumber: data['Mobile Number'].toString()
    };
}

function safeParseDate(dateStr) {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;

    const [day, month, year] = parts.map(Number);
    const date = new Date(year, month - 1, day); // JS Date: month is 0-indexed

    return isNaN(date.getTime()) ? null : date;
}


module.exports = {
    getCrimimalRecord,
    getCrimimalRecords,
    createCrimimalRecord,
    updateCrimimalRecord,
    deleteCrimimalRecord,
    uploadCriminalRecords,
    getCrimimalRecordByPhoneNumber
}