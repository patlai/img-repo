const vision = require('@google-cloud/vision');

async function RecognizeAllImages() {
    // Imports the Google Cloud client library
  
    // Creates a client
    const client = new vision.ImageAnnotatorClient();
  
    // Performs label detection on the image file
    const [result] = await client.labelDetection('./resources/wakeupcat.jpg');
    const labels = result.labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
}

module.exports = {
    RecognizeAllImages,
};