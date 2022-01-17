const fs = require("fs");
const AWS = require("aws-sdk");
const express = require("express");
const router = express.Router();
var cors = require("cors");
const path = require("path");
const multer = require("multer");
const axios = require("axios");
const db = require("../config/db");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp/"); // here we specify the destination . in this case i specified the current directory
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, file.originalname); // here we specify the file saving name . in this case i specified the original file name
  },
});

const maxSize = 2 * 1024 * 1024; //In Bytes - num * mega * kilo
const uploadImage = multer({
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function (req, file, cb) {
    // Set the filetypes, it is optional
    var filetypes = /jpeg|jpg|png|pdf/;
    var mimetype = filetypes.test(file.mimetype);

    var extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      // Check MIME types on top of FileExt
      return cb(null, true);
    } else {
      cb({ success: false, errMsg: "Invalid File format." }, false);
    }
  },
}).single("image");

const omnisendEmail = async (email, phone, tag) => {
  try {
    // tag: bogo_leads, acq_leads
    const date = new Date().toISOString();
    const url = `${process.env.OMNISEND_BASE_URL}/v3/contacts`;
    const headers = {
      "x-api-key": process.env.OMNISEND_API_KEY,
    };

    let identifiers = [];

    if (email) {
      identifiers = [
        ...identifiers,
        {
          id: email,
          type: "email",
          channels: {
            email: {
              status: "subscribed",
              statusDate: date,
            },
          },
        },
      ];
    }

    if (phone) {
      identifiers = [
        ...identifiers,
        {
          id: phone,
          type: "phone",
          channels: {
            sms: {
              status: "nonSubscribed",
              statusDate: date,
            },
          },
        },
      ];
    }

    const body = {
      tags: [tag],
      identifiers,
    };

    await axios.post(url, body, { headers });
  } catch (error) {
    console.log("error omnisendEmail", error.message);
  }
};

// ROUTES
router.post("/:zone/leadcapture", cors(), async (req, res, next) => {
  try {
    res.header("Access-Control-Allow-Origin", "*");

    const zone = req.params.zone.toUpperCase();
    const mobile = req.body.mobile;
    const email = req.body.email;
    const tag = req.body.tag;

    if (!mobile && !email) {
      res.status(400).json({
        message: "Mobile or Email is required",
      });
      return;
    }

    const date = new Date();
    const timestamp = date.toUTCString();
    const tags = `${tag}`;
    const query = `INSERT INTO leadcapture (zone, mobile_number, email, timestamp, tags) VALUES ('${zone}', '${
      mobile || ""
    }', '${email || ""}', '${timestamp}', '${tags}');`;

    await db.query(query);

    // trigger omnisend
    if (email && tag) {
      omnisendEmail(email, mobile, tag);
    }

    res.send({ success: true, message: "Saved" });
  } catch (err) {
    console.log("error leadcapture", err.message);
    res.send({ success: false, message: "Something went wrong" });
  }
});

router.post("/:zone/prescriptionUpload", (req, res) => {
  let zone = req.params.zone.toUpperCase();
  res.header("Access-Control-Allow-Origin", "*");

  uploadImage(req, res, (err) => {
    if (err) {
      if (err.code == "LIMIT_FILE_SIZE") {
        return res.send({ success: false, errMsg: "File size over 2MB." });
      }
      return res.send(err);
    }

    console.log("Request body: " + JSON.stringify(req.body));

    if (req.file && req.body.session && req.body.sku) {
      const awsBucketBaseurl =
        "https://3d-asset-lookr.s3-ap-southeast-1.amazonaws.com/";
      const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_S3_ID,
        secretAccessKey: process.env.AWS_S3_SECRET,
      });

      let fileContent = fs.readFileSync("temp/" + req.file.filename);
      let ext = path.extname(req.file.originalname);

      var s3params = {
        Bucket: process.env.BUCKET_NAME,
        Key:
          "orderprescription/" +
          zone +
          "/" +
          req.body.session +
          "-SKU" +
          req.body.sku +
          ext, // File name you want to save as in S3
        Body: fileContent,
        ACL: "public-read",
      };

      s3.upload(s3params, function (err, data) {
        if (err) {
          fs.unlinkSync("temp/" + req.file.filename, (err) => {
            if (err) {
              console.log(err);
            }
          });
          res.send({ success: false, errMsg: "S3 write error." });
        } else {
          fs.unlinkSync("temp/" + req.file.filename, (err) => {
            if (err) {
              console.log(err);
            }
          });
          console.log("S3 write success: " + JSON.stringify(data));
          res.send({ success: true, url: data.Location });
        }
      });
    } else {
      console.log("No file was uploaded");
      res.send({ success: false, errMsg: "No file was recieved." });
    }
  });
});

router.post("/:zone/translate", (req, res) => {
  console.log("Route was called");
  let zone = req.params.zone.toUpperCase();
  res.header("Access-Control-Allow-Origin", "*");
  console.log(req.body);

  AWS.config.update({ region: "ap-southeast-1" });

  var translate = new AWS.Translate({
    accessKeyId: process.env.AWS_TRANSLATE_ID,
    secretAccessKey: process.env.AWS_TRANSLATE_SECRET,
  });
  var params = {
    SourceLanguageCode: "auto",
    TargetLanguageCode: "en",
    Text: req.body.txtInput,
  };

  translate.translateText(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else res.send(data["TranslatedText"]);
  });
});

module.exports = router;
