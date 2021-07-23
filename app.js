var express = require("express");
// var fsPath = require('fs-path');
const app = express();
// const fs = require('fs');
// const path = require('path');
// const tf = require('@tensorflow/tfjs');
// const node = require('@tensorflow/tfjs-node');
// const mongoose = require('mongoose');
var fileupload = require("express-fileupload");
//Load Model face Api
import * as faceapi from 'face-api.js';
const MODEL_URL = './models/';
//Init Routes
const RegisterFace = require('./routes/RegisterFace.js');
const ReconFace = require('./routes/ReconFace');
const DelFace = require('./routes/DelFace');
// const DoAbsen = require('./routes/DoAbsen');
// const GeneratedFacesAligned = require('./routes/GenerateAlignedFaces');


//Protection String
// require('dotenv/config');

app.use(fileupload());
app.use('/registerface',RegisterFace);
app.use('/reconface',ReconFace);
app.use('/delface',DelFace);
// app.use('/doabsen',DoAbsen);
// app.use('/generateface',GeneratedFacesAligned);

//serve public image with hidden real folder
// app.use('/images',express.static(__dirname + '/uploads/image'))

//init to MongoDBAtlas via mongoose
// mongoose.connect( process.env.DB_CONNECTION,
//   { useUnifiedTopology: true }, () =>
//   console.log('Connection to DB Success!')
// );


// var username = null;

faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URL)
    .then(faceapi.nets.tinyFaceDetector.loadFromDisk(MODEL_URL))
    // .then(faceapi.nets.mtcnn.loadFromDisk(MODEL_URL))
    .then(faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URL))
    .then(faceapi.nets.faceLandmark68TinyNet.loadFromDisk(MODEL_URL))
    .then(faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URL))
    // .then(faceapi.nets.faceExpressionNet.loadFromDisk(MODEL_URL))
    // .then(faceapi.nets.ageGenderNet.loadFromDisk(MODEL_URL))
    .catch(error => {
        error.log(error);
    });

app.get("/", (req, res) =>{
    res.status(200).send("Hello Captain 😎");
});

app.listen(3000, () => {
    console.log("Started on port 3000");
});

