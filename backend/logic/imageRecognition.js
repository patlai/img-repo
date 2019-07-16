const vision = require("@google-cloud/vision");
const images = require("../routes/Images");
const threshold = 0.95;

async function RecognizeAllImages(imageNameList) {
  // Creates a client
  const client = new vision.ImageAnnotatorClient();

  let imageLabels = [];

  console.log(imageNameList);

  await Promise.all(
    imageNameList.map(async imageName => {
      // Performs label detection on the image file
      let filePath = `public/uploads/${imageName}`;
      const [result] = await client.labelDetection(filePath);

      // only get the labels with a score above the threshold
      const labels = result.labelAnnotations.filter(x => x.score > threshold).map(label => label.description);
      
      imageLabels.push({ imageName: imageName, labels: labels });
    })
  );

  return imageLabels;
}

module.exports = {
  RecognizeAllImages
};