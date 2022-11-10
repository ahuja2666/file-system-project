const express = require("express");
const router = express.Router();
require("dotenv").config()
const aws = require('aws-sdk')
const multer = require('multer')
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const shortid = require('shortid');

let s4 = new S3Client({
  region: 'ap-south-1',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.ACCESS_SECRET,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

aws.config.update({
  secretAccessKey: process.env.ACCESS_SECRET,
  accessKeyId: process.env.ACCESS_KEY,
  region: process.env.REGION,

});
const BUCKET = process.env.BUCKET
const s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s4,
    bucket: process.env.BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acls: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: async function (req, file, cb) {
      cb(null, String(shortid.generate()) + "+" + file.originalname);
    },
  }),
});

router.post('/upload', upload.single('file'), async function (req, res, next) {
  try {
    res.send("sucess " + req.file.filename)
  }
  catch (e) {
    res.send(e.message);
  }
});

router.get("/list", async (req, res) => {

  let r = await s3.listObjectsV2({ Bucket: BUCKET }).promise();
  let x = r.Contents.map(item => item.Key);
  res.send(x)
});


router.get("/download/:filename", async (req, res) => {
  try {
    const filename = req.params.filename
    let x = await s3.getObject({ Bucket: BUCKET, Key: filename }).promise();
    res.send(x.Body)
  } catch (e) {
    res.send(e.message);
  }
});


module.exports = router;