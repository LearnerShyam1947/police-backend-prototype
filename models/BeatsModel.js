const mongoose = require('mongoose');

const BeatsSchema = new mongoose.Schema({
    policeStation: { type: String },
    FirNo: { type: String },
    actsAndSections: { type: String },
    accusedName: { type: String },
    age: { type: Number },
    gender: { type: String },
    firDate: { type: Date },
    arrestDate: { type: Date },
    mobileNumber: { type: String },
    address: { type: String },

    mob: { type: String },    
    cgi: { type: String },    
    vlr: { type: String },    
    imei: { type: String },   
    imsi: { type: String },   
    
    latitude: { type: Number },   
    longitude: { type: Number },  
    mapUrl: { type: String },     
    lbsType: { type: String },    

    lastActivity: { type: Date }, 
    
    currentPoliceStation: { type: String }, 
    currentDate: { type: Date, default: Date.now },
    status: { type: String, default: "Not Meet" },
});

const Beats = mongoose.model('Beats', BeatsSchema);

module.exports = Beats;
