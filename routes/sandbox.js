const express = require('express');
const router = express.Router();
const controller = require('../controllers/sandbox');

const path = require('path');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "temp/"); // here we specify the destination . in this case i specified the current directory
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);// here we specify the file saving name . in this case i specified the original file name
    }
});

const maxSize = 2 * 1024 * 1024; //In Bytes - num * mega * kilo
const uploadImage = multer({
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb) {

        // Set the filetypes, it is optional
        var filetypes = /jpeg|jpg|png|pdf/;
        var mimetype = filetypes.test(file.mimetype);

        var extname = filetypes.test(path.extname(
            file.originalname).toLowerCase());

        if (mimetype && extname) { // Check MIME types on top of FileExt
            return cb(null, true);
        } else {
            cb({ success: false, errMsg: "Invalid File format." }, false)
        }
    }
}).single('image')

// ROUTES
router.get('/', controller.index);

router.post("/fileupload", (req, res) => {
    uploadImage(req, res, (err) => {
        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return res.send(
                    { success: false, errMsg: "File size over 2MB." }
                )
            }
            return res.send(err)
        }

        if (req.file ) {
            console.log(req.body)
    
            console.log("File uploaded: " + req.file.filename);
            console.log(req.file)
            res.send("file disk upload success");
        } else {
            console.log("No file was uploaded")
            res.send({ success: false, errMsg: "No file was recieved." })
        }
    })
});

/*
var position = 1;
    var s3filepath = "";
    var fileType = "";
    var awsBucketBaseurl = "https://3d-asset-lookr.s3-ap-southeast-1.amazonaws.com/";
    const s3 = new AWS.S3({accessKeyId: process.env.AWS_S3_ID, secretAccessKey: process.env.AWS_S3_SECRET});

    if (req.files !== 'undefined') {
        let fileList = req.files;
        if (fileList.length > 0) {
            var presFile = req.files[0].path;
            var fileContent = fs.readFileSync(presFile);
            var ext = path.extname(fileList[0].originalname);
            var currDate = new Date().getTime();
            var filename = 'COLLECTION_FILE__' + currDate + ext;
            var filenameonS3 = 'COLLECTION/' + filename;
            s3filepath = awsBucketBaseurl + filenameonS3;
            fileType = ext.replace(/./i, '');
            req.body.imageurl = s3filepath
            var fileparams = {
                Bucket: process.env.BUCKET_NAME,
                Key: filenameonS3, // File name you want to save as in S3
                Body: fileContent,
                ACL: 'public-read'
            };
            s3.upload(fileparams, function (err, data) {
                fs.unlink(presFile, (err) => {
                    if (err) {

                    } else {
                        s3filepath = awsBucketBaseurl + filenameonS3;
                        console.log("s3filepath", '' + s3filepath);
                    }
                });

                //err == null ? data : err;
            });
        }
    }var position = 1;
    var s3filepath = "";
    var fileType = "";
    var awsBucketBaseurl = "https://3d-asset-lookr.s3-ap-southeast-1.amazonaws.com/";
    const s3 = new AWS.S3({accessKeyId: process.env.AWS_S3_ID, secretAccessKey: process.env.AWS_S3_SECRET});

    if (req.files !== 'undefined') {
        let fileList = req.files;
        if (fileList.length > 0) {
            var presFile = req.files[0].path;
            var fileContent = fs.readFileSync(presFile);
            var ext = path.extname(fileList[0].originalname);
            var currDate = new Date().getTime();
            var filename = 'COLLECTION_FILE__' + currDate + ext;
            var filenameonS3 = 'COLLECTION/' + filename;
            s3filepath = awsBucketBaseurl + filenameonS3;
            fileType = ext.replace(/./i, '');
            req.body.imageurl = s3filepath
            var fileparams = {
                Bucket: process.env.BUCKET_NAME,
                Key: filenameonS3, // File name you want to save as in S3
                Body: fileContent,
                ACL: 'public-read'
            };
            s3.upload(fileparams, function (err, data) {
                fs.unlink(presFile, (err) => {
                    if (err) {

                    } else {
                        s3filepath = awsBucketBaseurl + filenameonS3;
                        console.log("s3filepath", '' + s3filepath);
                    }
                });

                //err == null ? data : err;
            });
        }
    }
*/

module.exports = router;