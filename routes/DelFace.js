const express  = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

router.post('/',function(req,res){
    var directory = "./uploads/"+req.body.user+"/";

    if(fs.existsSync(directory)) {
        fs.rmdirSync(directory, {recursive: true});

        res.send({
            success : true,
            message : "Dataset deleted!"
        });
    }
    else {
        res.send({
            success : false,
            message : "Folder does not exists!"
        });
    }

    // fs.readdir(directory, (err, files) => {
    //     if (err) throw err;
    //     else
    //         for (const file of files) {
    //             console.log(file);
    //             fs.unlink(path.join(directory, file), err => {
    //                 if (err) throw err;
    //             });
    //         }
    //         res.send({
    //             success : true,
    //             message : "File Deleted!"
    //         });
    // });
});

module.exports = router;