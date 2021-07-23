import * as faceapi from 'face-api.js';
const express  = require('express');
var fsPath = require('fs-path');
const tf = require('@tensorflow/tfjs');
const node = require('@tensorflow/tfjs-node');
const fs = require('fs');
const router = express.Router();



var username = null;

router.post('/', async function(req,res){
    username = req.body.user; 
    
    var OutputFile ='./uploads/'+username+'/'+username+'.json';
    
  
      fs.access(OutputFile, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
          // console.error(
          //   ` ${err.code === 'ENOENT' ? 'does not exist' : 'is read-only'}`);
            res.send({
              success : true,
              status : 0,
              message : "Anda tidak memiliki dataset sebelumnya"
          });
            
         
        } else {
          //console.log(`file exists, and it is writable`);
          res.send({
            success : true,
            status : 1,
            message : "Anda telah memiliki dataset wajah anda!"
        });       
          
        }
      });
  
  });

module.exports = router;