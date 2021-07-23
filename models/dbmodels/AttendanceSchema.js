const mongoose = require('mongoose');
const moment = require('moment');
var myDate = new Date();

const AttendanceSchema = mongoose.Schema({
    IMAGES : {
        type : String,
        require : true
    },
    TR_DATE : {
        type : Date,
        default : moment().utc(true).format()
    },
    TR_DATE_STRING : {
        type : String,
        default : moment().utc(true).format("MM/DD/YYYY HH:mm:ss")
    },
    TIPE :{
        type : Number,
        require : true
    },
    DEVICE_TYPE : {
        type : String,
        require : true
    },
    MESSAGE : {
        type : String
    },
    LOCATION : {
        type : String,
        require : true
    },
    LAT : {
        type : String,
        require : true
    },
    LNG : {
        type : String,
        require : true
    },
    NIP : {
        type : String,
        require : true
    },
    STATUS : {
        type : String,
        require : true
    }   
});

module.exports = mongoose.model('Attendance',AttendanceSchema);

