const mongoose = require('mongoose');

const CrimialSchema = new mongoose.Schema({
    policeStation: { type: String },  
    FirNo: { type: String },  
    actsAndSections: { type: String },  
    accusedName: { type: String },  
    age: { type: Number },  
    gender: { type: String },  
    firDate: { type: Date },  
    arrestDate: { type: Date },  
    mobileNumber: { type: String },  
    address: { type: String }  
});


const CriminalModel = mongoose.model('Criminals', CrimialSchema);

module.exports = CriminalModel;
