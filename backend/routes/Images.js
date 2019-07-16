const mysql = require("../sql/connection");
const imageRecognition = require("../logic/imageRecognition")
const rootUploadFolder = "static/uploads/"

const groupBy = key => array =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

function groupImagesByFileName(tagPayload, key){
  return (groupBy(key))(tagPayload)
}

function GetDateString(){
  let currYear = new Date().getFullYear();
  let currMonth = new Date().getMonth();
  let currDay = new Date().getDate();
  let currDate = `${currYear}-${currMonth}-${currDay}`;
  return currDate
}

var addImage = async imageName => {

  console.log("trying to add image: " + imageName)

  let connection = await mysql.getNewConnection();
  try {
    await connection.query("INSERT INTO Images (fileName, date, description) VALUES (?, ?, ?);", [imageName, GetDateString(), ""]);
    return true;
  } catch (error) {
    console.error(error);
    throw new Error(false);
  } finally {
    connection.release();
  }
};

var addImages = async imageNames => {

  console.log("trying to add multiple images into the database")

  let connection = await mysql.getNewConnection();
  try {
    let currentFiles = await connection.query("SELECT fileName FROM Images;");
    let currentFileNames = new Set(currentFiles.map(f => f["fileName"]))

    // only get the images that aren't already in the db
    imageNames = imageNames.filter(f => !currentFileNames.has(f))
    
    let labels = await imageRecognition.RecognizeAllImages(imageNames)
    console.log(labels)
    addLabels(labels)

    let payload = imageNames.map(i => [i, GetDateString(), ""])
    await connection.query("INSERT INTO Images (fileName, date, description) VALUES ?;", [payload]);
    
    return labels;
  } catch (error) {
    console.error(error);
    throw new Error(false);
  } finally {
    connection.release();
  }
};

// [{imageName: "something", labels: [array of strings]}]
var addLabels = async imageLabels => {
  let connection = await mysql.getNewConnection();
  try{
    console.log("trying to insert tags into database")
    let payload = imageLabels.map(il => il.labels.map(label => [0, label, il.imageName])).flat()
    await connection.query("INSERT INTO Tags (tagId, tag, imageFileName) VALUES ?;", [payload]);
  } catch (error) {
    console.error(error);
    throw new Error(false);
  } finally {
    connection.release();
  }
}

var getImageByFileName = async imageName => {
  console.log("trying get image: " + imageName)

  let connection = await mysql.getNewConnection();
  try{
    let res = await connection.query("SELECT fileName FROM Images WHERE fileName = ?", imageName);
    let name = res.map(c => c["fileName"])[0]
    return name
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    connection.release();
  }
};

var getAllImages = async () => {
  let connection = await mysql.getNewConnection();
  try{
    let res = await connection.query("SELECT fileName FROM Images");
    return res.map(c => c["fileName"])
  } catch (error) {
    console.error(error);
    return null;
  } finally {
    connection.release();
  }
}

var getAllTags = async () => {
  let connection = await mysql.getNewConnection();
  try{
    let res = await connection.query("SELECT tag, imageFileName FROM Tags");
    res = res.map(t => {
      return {tag: t.tag, imageFileName: createImagePath(t.imageFileName)}
    })

    return groupImagesByFileName(res, 'imageFileName')
  } catch (error){
    console.error(error);
    return null;
  } finally {
    connection.release();
  }
}

var createImagePath = imageName => {
  return `${rootUploadFolder}${imageName}`
};

module.exports = {
  groupImagesByFileName,
  addImage,
  addImages,
  getImageByFileName,
  getAllImages,
  getAllTags,
  createImagePath,
};