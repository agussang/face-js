import * as faceapi from 'face-api.js';
const express  = require('express');
const node = require('@tensorflow/tfjs-node');
const fs = require('fs');
const router = express.Router();

var username = null;

router.post('/', async function(req,res){
    try {
        // var start = new Date()
        // var hrstart = process.hrtime()
        // var simulateTime = 15

        // const file = req.files.photo;
        
        const imageSource = req.files.photo.data;
        username = req.body.user;

        // var base64Image = imageSource.toString('base64');
        // var decodedImage = new Buffer.from(base64Image, 'base64');
        const nm =  node.node.decodeImage(new Uint8Array(imageSource));
        
        // console.log(nm);

        // inputSize -> 128, 160, 224, 320, 416, 512, 608 (divisible by 32)
        let fullDesc = await faceapi.detectSingleFace(nm, new faceapi.TinyFaceDetectorOptions({inputSize: 224}))
            .withFaceLandmarks()
            .withFaceDescriptor();

        node.dispose(nm);

        // setTimeout(function (argument) {
        //     var end = new Date() - start,
        //         hrend = process.hrtime(hrstart)
    
        //     console.info('Execution time: %dms', end)
        //     console.info('Execution time (second): %d s ',  hrend[0]+(Math.round((hrend[1] / 1e9) * 100) / 100).toFixed(2)  )
        //     }, simulateTime);

        if(fullDesc) {
            var OutputFile ='./uploads/'+username+'/'+username+'.json';
     
            var obj = JSON.parse(fs.readFileSync(OutputFile, 'utf8'));
            var obj2 = obj.map( x=> faceapi.LabeledFaceDescriptors.fromJSON(x));
            const faceMatcher = new faceapi.FaceMatcher(
                obj2,
                0.5
            );

            const bestMatch = faceMatcher.findBestMatch(fullDesc.descriptor);

            if(bestMatch.label == "unknown") {
                res.send({
                    success : false,
                    message : "Wajah tidak dikenali",
                    profil : "unknown"
                });
            }
            else {
                res.send({
                    success : true,
                    message : "Wajah berhasil dikenali",
                    profil : bestMatch.label
                });
            }
        }
        else {
            res.send({
                success : false,
                message : "Wajah tidak dikenali",
                profil : "unknown"
            });
        }
    } catch(e) {
        console.log(e);
		var msg=e.message|| e.toString();
		if(e.code === 'ENOENT')
		{
			msg="Registrasi Anda gagal. Harap logout dan registrasi kembali.";
		}
        res.send({
            success : false,
            message : msg,           
        });   
    }
});

module.exports = router;