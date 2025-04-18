const excelToJson = require("../utils/FileUtils");
const checkPointsInRegions = require("../utils/MapUtils");
const { default: axios } = require("axios");
const Beats = require("./../models/BeatsModel")

const uploadBeatsRecords = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const jsonData = excelToJson(req.file.buffer);
        const formattedRecords = jsonData.map(mapLocationData);
        const finalRecords = checkPointsInRegions(formattedRecords);        
        const createdRecords = [];


        for (const record of finalRecords) {

            const response = await axios.get(`http://localhost:3000/api/v1/criminals/phone-number/${record.mob}`);
            console.log(record.mob, "    ", response.data);
            
            const additionalDetails = response.data;

            const newBeatsRecord = new Beats({
                mob: record.mob,
                cgi: record.cgi,
                vlr: record.vlr,
                imei: record.imei,
                imsi: record.imsi,
                latitude: record.latitude,
                longitude: record.longitude,
                mapUrl: record.mapUrl,
                lbsType: record.lbsType,

                policeStation: additionalDetails.policeStation || '',
                FirNo: additionalDetails.FirNo || '',
                actsAndSections: additionalDetails.actsAndSections || '',
                accusedName: additionalDetails.accusedName || '',
                age: additionalDetails.age || '',
                gender: additionalDetails.gender || '',
                firDate: additionalDetails.firDate || '',
                arrestDate: additionalDetails.arrestDate || '',
                mobileNumber: additionalDetails.mobileNumber || '',
                address: additionalDetails.address || '',
                lastActivity: new Date(),
                currentPoliceStation: record.currentPoliceStation || '',
                currentDate: new Date()
            });


            // await newBeatsRecord.save();
            createdRecords.push(newBeatsRecord);
        }

        // Insert data into MongoDB
        const records = await Beats.insertMany(createdRecords);

        res.status(200).json({
            message: `${records.length} records successfully inserted into the database`,
            records: records
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the file' });
    }
}

const getTodaysBeats = async (req, res) => {
    try {
        const today = new Date();
        
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); 
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const { currentPoliceStation } = req.query;
        
        const filter = {
            currentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        };
        
        if (currentPoliceStation) {
            filter.currentPoliceStation = currentPoliceStation;
        }
        
        const todaysBeats = await Beats.find(filter);

        res.status(200).json({
            success: true,
            data: todaysBeats
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};

const getTodaysUnMapBeats = async (req, res) => {
    try {
        const today = new Date();
        
        const startOfDay = new Date(today.setHours(0, 0, 0, 0)); 
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        
        const filter = {
            currentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            currentPoliceStation: "Not Found"
        };
        
        
        const todaysBeats = await Beats.find(filter);

        res.status(200).json({
            success: true,
            message: `total records : ${todaysBeats.length}`,
            data: todaysBeats
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        });
    }
};


const updateBeatStatus = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "ID is required" });
        }

        const updatedBeat = await Beats.findByIdAndUpdate(
            id,
            { status: "Met", lastActivity: new Date() },
            { new: true } // returns the updated document
        );

        if (!updatedBeat) {
            return res.status(404).json({ success: false, message: "Beat record not found" });
        }

        res.status(200).json({
            success: true,
            message: "Status updated to 'Met'",
            data: updatedBeat
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

const updateBeatPoliceStation = async (req, res) => {
    try {
        const { id } = req.params;
        const { ps } = req.query;

        if (!id || !ps) {
            return res.status(400).json({ success: false, message: "ID and PS are required" });
        }

        const updatedBeat = await Beats.findByIdAndUpdate(
            id,
            { currentPoliceStation: ps },
            { new: true } // returns the updated document
        );

        console.log("calling ............ ", id, "  ->  ", ps);
        

        if (!updatedBeat) {
            return res.status(404).json({ success: false, message: "Beat record not found" });
        }

        res.status(200).json({
            success: true,
            message: "Status updated to 'Met'",
            data: updatedBeat
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message
        });
    }
};

function mapLocationData(data) {
    return {
        mob: data.MOB || data['Mobile Number'],
        cgi: data.CGI,
        vlr: data.VLR,
        imei: data.IMEI,
        imsi: data.IMSI,
        latitude: data.Lat || data.Latitude,
        longitude: data.Long || data.Longitude,
        mapUrl: data.MapsLink || `http://maps.google.com/maps?q=${data.Lat},${data.Long}`,
        lbsType: data.LBSType,
        currentPoliceStation: data.currentPoliceStation
    };
}

module.exports = {
    uploadBeatsRecords,
    updateBeatStatus,
    getTodaysBeats,
    updateBeatPoliceStation,
    getTodaysUnMapBeats
}
