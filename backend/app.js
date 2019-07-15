const express = require('express');
const multer = require('multer');
const path = require('path')
//const upload = multer({dest: __dirname + 'public/uploads/images'});
const router = express.Router();

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
      console.log("Request ---", req.body);
      console.log("Request file ---", req.file);
      
      if(!err) {
          return res.sendStatus(200).end();
      }
  })
})

// retrieve an image
app.get('/getImage', function (req, res){
  console.log(req);
  res.send('static/uploads/IMAGE-1563083113002.png');
})

app.listen(PORT, () => {
    console.log('Image repo started. Listening at ' + PORT );
});