import * as faceapi from 'face-api.js';
const express  = require('express');
const router = express.Router();
const fs = require('fs');
const shortid = require('shortid');
var fsPath = require('fs-path');
const path = require('path');
const tf = require('@tensorflow/tfjs');
const node = require('@tensorflow/tfjs-node');
const moment = require('moment');

const Attendance = require('../models/dbmodels/AttendanceSchema')
var username = null;

router.get('/lastactivity',async function(req,res){
    //console.log(moment().format());
    try{
        const AttendanceIN = await Attendance.find({
            TIPE : 1,
            TR_DATE : {"$gt": moment().add(-1, 'day').utc(true).format()}
        }).sort({
            TR_DATE: -1
        }).limit(2);
        const AttendanceOut = await Attendance.find({
            TIPE : 2,
            TR_DATE : {"$gt": moment().add(-1, 'day').utc(true).format()}
        }).sort({
            TR_DATE: -1
        }).limit(2);
        
        //console.log( res.json(saveAttendance));
        //res.json({ "CLOCK_IN": AttendanceIN, "CLOCK_OUT": AttendanceOut });
        res.header("Content-Type",'application/json');
        res.send(JSON.stringify({ "CLOCK_IN": AttendanceIN, "CLOCK_OUT": AttendanceOut }, null, 4));
    }catch(err){

    }
});

router.get('/checklastseen',async function(req,res){
    //console.log(moment().format());
    try{
        const Attendances = await Attendance.find().sort({
            TR_DATE: -1
        }).limit(1);
        res.header("Content-Type",'application/json');
        res.send(JSON.stringify(Attendances, null, 4));
        
        //console.log( res.json(saveAttendance));
        //res.json(Attendances);
    }catch(err){
        res.json({message : err});
    }
});


router.post('/',async function(req,res) {
    const file = req.files.IMAGES;  
    try{
        var start = new Date()
        var hrstart = process.hrtime()
        var simulateTime = 15
        var totalexec = null;

        const imageSource = req.files.IMAGES.data; 
        username = req.body.NIP;  
        var base64Image = imageSource.toString('base64');
        var decodedImage = new Buffer.from(base64Image, 'base64');
        const nm =  node.node.decodeImage(new Uint8Array(decodedImage));
        
        let statusIcons = {
          neutral: 'netral',
          happy: 'senang',
          sad: 'sedih',
          angry: 'marah',
          fearful: 'takut',
          disgusted: 'jijik',
          surprised: 'terkejut'
        }
            let fullDesc = await faceapi.detectSingleFace(nm)
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender()
            .withFaceDescriptor();
            let status = "";
            let valueStatus = 0.0;
            for (const [key, value] of Object.entries(fullDesc.expressions)) {
              if (value > valueStatus) {
                status = key
                valueStatus = value;
              }
            }
        

        var OutputFile ='./uploads/'+username+'/'+username+'.json';
            var obj = JSON.parse(fs.readFileSync(OutputFile, 'utf8'));
            var obj2 = obj.map( x=> faceapi.LabeledFaceDescriptors.fromJSON(x) );
            const faceMatcher = new faceapi.FaceMatcher(
                obj2,
                0.5
            );
            const bestMatch = faceMatcher.findBestMatch(fullDesc.descriptor)
            
            setTimeout(function (argument) {
                // execution time simulated with setTimeout function
                var end = new Date() - start,
                    hrend = process.hrtime(hrstart)
                    totalexec =hrend[0]+(Math.round((hrend[1] / 1e9) * 100) / 100).toFixed(2) ;
        
                console.info('Execution time: %dms', end)
                console.info('Execution time (second): %d s ',  hrend[0]+(Math.round((hrend[1] / 1e9) * 100) / 100).toFixed(2)  )
                }, simulateTime)


            console.log(bestMatch);
            if(bestMatch.label === 'unknown'){
                res.json({message: 'Wajah tidak dikenali'})
            }else{
                var fullnamefile = shortid.generate()+path.extname(req.files.IMAGES.name);
                var pathfile = "./uploads/image/"+fullnamefile;
                file.mv(pathfile, function (err,result)  {
                    if (err)
                        console.log(err);
                })
                const attendance = new Attendance({
                    IMAGES : fullnamefile,
                    TR_DATE : moment().utc(true).format(),
                    TR_DATE_STRING :moment().utc(true).format("MM/DD/YYYY HH:mm:ss"),
                    TIPE : req.body.TIPE,
                    DEVICE_TYPE : req.body.DEVICE_TYPE,
                    MESSAGE : req.body.MESSAGE,
                    LOCATION : req.body.LOCATION,
                    LAT : req.body.LAT,
                    LNG : req.body.LNG,
                    NIP : req.body.NIP,
                    STATUS : statusIcons[status]
                });
                
                try{
                    var clock = null;
                    if (req.body.TIPE == 1){
                        clock = 'Clock IN';
                    }else {
                        clock = 'Clock OUT';
                    }
                    const saveAttendance = await attendance.save();
                    console.log(saveAttendance.TR_DATE);
                    //await cons attendance.save();
                    res.json({
                        saveAttendance,
                        result : true,
                        message : 'Berhasil melakukan '+ clock,
                        message2 : totalexec
                    });
                } catch (err){
                    res.json({
                        result : false,
                        message: err})
                }
        }

    } catch (err){
        res.json({
            result : false,
            message: err
        })
        //res.send({message : err});
    }

    
});

module.exports = router;