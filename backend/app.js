const express = require('express');
const multer = require('multer');
const path = require('path')
//const upload = multer({dest: __dirname + 'public/uploads/images'});
const router = express.Router();

const app = express();
const PORT = 3001;

app.use(express.static('public'));

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

  const storage = multer.diskStorage({
    destination: "./public/uploads/",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });
 
 const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
 }).single("myImage");

 app.post('/upload', function (req, res) {
  upload(req, res, function (err) {
      console.log("Request ---", req.body);
      console.log("Request file ---", req.file);
      
      if(!err) {
          return res.sendStatus(200).end();
      }
  })
})

// app.post('/upload', upload.single('photo'), (req, res) => {
//     if(req.file) {
//         console.log("image received: " + req.file.originalname);
//         res.json(req.file);
//     }
//     else throw 'error';
// });

app.listen(PORT, () => {
    console.log('Image repo started. Listening at ' + PORT );
});