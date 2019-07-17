import React from "react";
import Api from './services/Api';
import './UploadImage.css';

class UploadImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      file: null,
      files: [],
      images: [],
      imageTags: null,
      filteredImages: null,
      tags: [],
      baseURL: "",
    };

    this.onFormSubmitMulti = this.onFormSubmitMulti.bind(this);
    this.onChangeMulti = this.onChangeMulti.bind(this);
    this.retrieveAllImages = this.retrieveAllImages.bind(this);
    this.renderImage = this.renderImage.bind(this);
    this.renderImagesWithTags = this.renderImagesWithTags.bind(this);
    this.renderTags = this.renderTags.bind(this);
    this.getUniqueTags = this.getUniqueTags.bind(this);
  }

  componentDidMount = () => {
    this.retrieveAllImages();
  };

  renderTags(){
    return this.state.tags.map(tag => 
      <button>{tag}</button>
    )
  }

  getUniqueTags(payload) {
    let uniqueTags = new Set()

    for (var key in payload){
      let tags = payload[key].map(tagImagePair => tagImagePair.tag)

      tags.forEach(tag => {
        if (!uniqueTags.has(tag)){
          uniqueTags.add(tag)
        }
      });
    }

    return Array.from(uniqueTags)
  }

  // render all images with their respective tags below them
  renderImagesWithTags(payload) {
    console.log(payload)

    let result = []
    for (var key in payload){

      // key should be the image path without the server's url
      let tags = payload[key].map(tagImagePair => tagImagePair.tag)
      let tagsHtml = tags.map(tag => <div>{tag}</div>)
      let imageSrc = this.state.baseURL + key

      result.push(
        <div className="imageWrapper">
          <img src={imageSrc} className="gallery"/>
          {tagsHtml}
        </div>
      )
    }
    return result
  }

  retrieveAllImages() {
    Api().get("/getAllImages").then(res => {
      console.log(res.data)
      console.log(typeof res.data)
      this.setState({
        baseURL: res.config.baseURL,
        images: Object.keys(res.data).map(fileName => (res.config.baseURL + fileName)),
        imageTags: res.data,
        tags: this.getUniqueTags(res.data),
      })
    })
  }

  onFormSubmitMulti(e){
    e.preventDefault();

    const formData = new FormData();

    this.state.files.forEach( i => formData.append("myImages", i))

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    console.log(this.state.files)
    console.log(formData)

    Api().post("/multiUpload", formData, config)
      .then(res => {
        console.log(res.data.length + " Images successfully uploaded");
        console.log(res.data);
        this.setState({
          images: [...this.state.images, ...Object.keys(res.data).map(fileName => (res.config.baseURL + fileName))],
          imageTags: {...this.state.imageTags, ...res.data},
          tags: [...this.state.tags, ...this.getUniqueTags(res.data)],
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderImage(imageSrc) {
    return (<img src={imageSrc} className="gallery"/>)
  }

  onChangeMulti(e) {
    this.setState({ files: [...e.target.files] });
  }

  render() {
    return (
      <div> 
         <h1 className="section">Image Lockr</h1>
        <div className="section">
          <p>
            Welcome to Image Lockr! This is an AI powered image repository that will apply state of the art Image Recognition Machine Learning
            models to auto-tag your images. Start uploading one or more images below and have tags auto-generated for you!
          </p>
        </div>
        <div className="section">
          <div className="uploadSection">
            <form onSubmit={this.onFormSubmitMulti}>
              <input type="file" name="myImages" multiple="multiple" onChange={this.onChangeMulti} />
              <button type="submit">Upload</button>
            </form>
          </div>
        </div>

        {/* <button onClick={this.retrieveAllImages}>get all images</button> */}
        <div>
          <h2 className="section">My Tags</h2>
          <div className="tags">
            { this.renderTags() }
          </div>
          <h2 className="section">My Images</h2>
          <div className="imageGallery">
            { this.renderImagesWithTags(this.state.imageTags) }
          </div>
        </div>
      </div>
    );
  }
}

export default UploadImage;
