const express = require('express');
const multer = require('multer');
const path = require('path')
const router = express.Router();
const images = require("./logic/Images")

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
    limits:{fileSize: 1000000},
 }).single("myImage");

 app.post('/upload', function (req, res) {
  uploadSingle(req, res, function (err) {
      //console.log("Request ---", req.body);
      //console.log("Request file ---", req.file);
      fileName = req.file.filename
      console.log(fileName);
      images.addImage(fileName);
     
      if(!err) {
        return res.send(images.createImagePath(fileName)).end();
        //return res.sendStatus(200).end();
      }
  })
})

// retrieve all images
app.get('/getAllImages', async function (req, res){
  console.log("getting all images")
  imageFileNames = await images.getAllImages();
  console.log(imageFileNames)
  imagePaths = imageFileNames.map(name => images.createImagePath(name));
  res.send(imagePaths);
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