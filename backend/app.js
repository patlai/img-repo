const express = require('express');
const multer = require('multer');
const path = require('path')
const router = express.Router();
const images = require("./routes/Images")
const util = require("./logic/util")

const maxFileSize = 1000000;

const app = express();
const PORT = 3001;

// public folder where uploaded images are stored
app.use(express.static('public'));
app.use('/static', express.static(path.join(__dirname, 'public')))

// allow CORS from the frontend
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
  
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-Requested-With,content-type"
    );
  
    res.setHeader("Access-Control-Allow-Credentials", true);
  
    next();
  });

  // store iamges on the file system of the server
  const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });
 
 // single image upload
 const uploadSingle = multer({
    storage: storage,
    limits:{fileSize: maxFileSize},
 }).single("myImage");

// multi image upload
const uploadMulti = multer({
  storage: storage,
  limits:{filesize: maxFileSize},
}).array("myImages");

 app.post('/upload', function (req, res) {
  uploadSingle(req, res, function (err) {
      //console.log("Request ---", req.body);
      //console.log("Request file ---", req.file);
      fileName = req.file.filename
      console.log(fileName);
      images.addImage(fileName);
     
      if(!err) {
        return res.send(images.createImagePath(fileName)).end();
      }
  })
})

app.post('/multiUpload', function (req, res) {
  uploadMulti(req, res, async function (err) {
      // only get the unique filenames
      // known issue: sometimes files will be lost because 2 files coming from the user receive the same file name from multer
      let fileNames = req.files.map(f => f.filename).filter(util.onlyUnique);

      console.log("UPLOADED FILES: ")
      console.log(fileNames)

      let labels = await images.addImages(fileNames);

      if(!err) {
        console.log("LABELS AFTER UPLOADING:")
        console.log(labels)
        return res.send(labels).end();
        //return res.send(fileNames.map(f => images.createImagePath(f))).end();
        //return res.sendStatus(200).end();
      }
  })
})

// retrieve all images
app.get('/getAllImages', async function (req, res){
  console.log("getting all images")
  imageFileNames = await images.getAllImages();
  let tags = await images.getAllTags();

  res.send(tags);
});

// retrieve an image
app.get('/getImage', async function (req, res){
  //console.log(req);
  imageResult = await images.getImageByFileName('IMAGE-1563168965803.png');
  res.send(images.createImagePath(imageResult));
});

app.listen(PORT, () => {
  console.log('Image repo started. Listening at ' + PORT );
});