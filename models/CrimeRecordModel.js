const mongoose = require("mongoose");

const CrimeRecordSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "CrimeRecord name is required"]
        },
        description: {
            type: String,
            required: [true, "CrimeRecord description is required"]
        },
        crimeType: {
            type: String,
            required: [true, "Crime type is required"]
        },
        date: {
            type: Date,
            required: [true, "Crime date is required"]
        },
        latitude: {
            type: Number,
            required: [true, "Latitude is required"]
        },
        longitude: {
            type: Number,
            required: [true, "Longitude is required"]
        },
        detailedAddress: {
            type: String,
            required: [true, "Detailed address is required"]
        }
    },
    {
        collection: 'CrimeRecords',
        timestamps: true
    }
);

const CrimeRecordModel = mongoose.model("CrimeRecord", CrimeRecordSchema);

module.exports = CrimeRecordModel;
