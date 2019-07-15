const mysql = require("../sql/connection");

var addImage = async imageName => {

  console.log("trying to add image: " + imageName)

  let connection = await mysql.getNewConnection();
  try {
    let currYear = new Date().getFullYear();
    let currMonth = new Date().getMonth();
    let currDay = new Date().getDate();
    let currDate = `${currYear}-${currMonth}-${currDay}`;
    console.log(currDate);

    await connection.query("INSERT INTO Images (fileName, date, description) VALUES (?, ?, ?);", [imageName, "2019-06-14", ""]);
    return true;
  } catch (error) {
    console.error(error);
    throw new Error(false);
  } finally {
    connection.release();
  }
};

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

module.exports = {
  addImage,
  getImageByFileName,
  getAllImages,
};