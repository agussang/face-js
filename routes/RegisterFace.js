import * as faceapi from 'face-api.js';
const express  = require('express');
var fsPath = require('fs-path');
const node = require('@tensorflow/tfjs-node');
const fs = require('fs');
const router = express.Router();

var username = null;

router.post('/', async function(req,res) {

    username = req.body.user; 
    const file = req.files.photo.data;

    // console.log(file);
    // console.log(req.body.user);
  
    var OutputFilew = './uploads/'+username+'/'+username+'.json';

    // tambahan untuk dev, foto capture disimpan untuk data ujicoba
    //   file.mv("./uploads/"+req.body.user+"/"+req.body.user+path.extname(file.name), function (err,result)  {
    //     if (err)
    //         throw err;
        
    // });
    // var base64Image = file.toString('base64');
    // var decodedImage = new Buffer.from(base64Image, 'base64');
    const nm = node.node.decodeImage(new Uint8Array(file));

    // let inputSize = 512;
    // let scoreThreshold = 0.5;
    // const OPTION = new faceapi.TinyFaceDetectorOptions({
    //     inputSize,
    //         scoreThreshold
    //     });
    // const useTinyModel = true;
    // let fullDesc = await faceapi.detectSingleFace(nm, OPTION)
    //             .withFaceLandmarks(useTinyModel)
    //             .withFaceDescriptor();

    // let fullDesc = await faceapi.detectSingleFace(nm)
    // inputSize -> 128, 160, 224, 320, 416, 512, 608 (divisible by 32)
    let fullDesc = await faceapi.detectSingleFace(nm, new faceapi.TinyFaceDetectorOptions({inputSize: 224}))
                .withFaceLandmarks()
                .withFaceDescriptor();

    node.dispose(nm);

    let descriptors = [new Float32Array(fullDesc.descriptor)];
    var OutputFile ='./uploads/'+username+'/'+username+'.json';

    fs.access(OutputFile, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
            // console.error(`${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
            let labeledDescriptors = [new faceapi.LabeledFaceDescriptors(username, descriptors)];
            var labeledFaceDescriptorsJsonN = labeledDescriptors.map(x=>x.toJSON());

            fsPath.writeFile(OutputFile, JSON.stringify(labeledFaceDescriptorsJsonN, null, 4), function(err) {
                if(err) {
                    throw err;
                }
                else {
                    // console.log('wrote a file like DaVinci drew machines');
                    res.send({
                        success: true,
                        message: "Dataset wajah berhasil tersimpan!",
                        profil: username,
                        dataset: 1
                    });
                }
            });
        } 
        else {
            // console.log(`file exists, and it is writable`);
            var count = 0;
            var obj = JSON.parse(fs.readFileSync(OutputFile, 'utf8'));
            var obj2 = obj.map(x => faceapi.LabeledFaceDescriptors.fromJSON(x));
            const faceMatcher = new faceapi.FaceMatcher(obj2, 0.5);

            //const face2 = fullDesc.expressions;
            const bestMatch = faceMatcher.findBestMatch(fullDesc.descriptor);
            if(bestMatch.label == username) {
                let descriptorsNew = [new Float32Array(fullDesc.descriptor)];
                let labeledDescriptors = [new faceapi.LabeledFaceDescriptors(username, descriptorsNew)];
           
                for (var i= 0; i < obj2[0].descriptors.length; i++) {
                    count += 1;
                    labeledDescriptors[0].descriptors[count] = obj2[0].descriptors[i];
                }

                var labeledFaceDescriptorsJsonE = labeledDescriptors.map(x => x.toJSON());
                fsPath.writeFile(OutputFile, JSON.stringify(labeledFaceDescriptorsJsonE, null, 4), function(err) {
                    if(err) {
                        throw err;
                    }
                    else {
                        // console.log('wrote a file like DaVinci drew machines');
                        res.send({
                            success: true,
                            message: "Dataset wajah berhasil tersimpan!!",
                            profil: bestMatch.label,
                            dataset: count + 1
                        });
                    }
                });
            }
            else {
                res.send({
                    success: false,
                    message: "Wajah anda tidak sesuai dengan dataset yang tersimpan sebelumnya!"
                });
            }
        }
    });
});

module.exports = router;