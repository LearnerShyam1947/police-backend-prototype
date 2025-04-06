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
        const dataWithCPS = checkPointsInRegions(jsonData);
        const formattedRecords = dataWithCPS.map(mapLocationData);
        const createdRecords = [];


        for (const record of formattedRecords) {

            const response = await axios.get(`http://localhost:3000/api/v1/criminals/phone-number/${record.mob}`);
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

function mapLocationData(data) {
    return {
        mob: data.MOB,
        cgi: data.CGI,
        vlr: data.VLR,
        imei: data.IMEI,
        imsi: data.IMSI,
        latitude: data.Lat,
        longitude: data.Long,
        mapUrl: `http://maps.google.com/maps?q=${data.Lat},${data.Long}`,
        lbsType: data.LBSType,
        currentPoliceStation: data.currentPoliceStation
    };
}

module.exports = {
    uploadBeatsRecords,
    getTodaysBeats
}
