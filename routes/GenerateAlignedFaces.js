import * as faceapi from 'face-api.js';
const express  = require('express');
var fsPath = require('fs-path');
const tf = require('@tensorflow/tfjs');
const node = require('@tensorflow/tfjs-node');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const canvas = require("canvas")  

const { Canvas, Image, ImageData } = canvas  
faceapi.env.monkeyPatch({ Canvas, Image, ImageData })

var username = null;

router.post('/', async function(req,res){
    try {
        var start = new Date()
        var hrstart = process.hrtime()
        var simulateTime = 5

        setTimeout(function (argument) {
        // execution time simulated with setTimeout function
        var end = new Date() - start,
            hrend = process.hrtime(hrstart)

        console.info('Execution time: %dms', end)
        console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
        }, simulateTime)


        username = req.body.user; 
        const myimg = await canvas.loadImage('./uploads/ardian/'+username+'.jpeg');
        const options = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.8 })
        let fullDesc = await faceapi.detectAllFaces(myimg,options);
        const canvasn = await faceapi.createCanvasFromMedia(myimg);
        const faceImages = await faceapi.extractFaces(canvasn, fullDesc);
        faceImages.forEach(canvas => 
            fs.writeFileSync('./uploads/'+username+'/'+username+'alignedFaces.jpeg', canvas.toBuffer('image/jpeg'))
        );
        res.send({
            success : true,
            message : "Berhasil generate aligned Faces"
        });
    } catch(e) {
        console.log(e);
        res.send(e.message || e.toString());
    }
});

module.exports = router;