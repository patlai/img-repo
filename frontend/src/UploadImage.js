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
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onFormSubmitMulti = this.onFormSubmitMulti.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeMulti = this.onChangeMulti.bind(this);
    this.retrieveImage = this.retrieveImage.bind(this);
    this.retrieveAllImages = this.retrieveAllImages.bind(this);
    this.renderImage = this.renderImage.bind(this);
  }

  componentDidMount = () => {
    this.retrieveAllImages();
  };

  retrieveImage() {
    Api().get("/getImage").then(res => {
      console.log(res)
      this.setState({
        images: [...this.state.images, res.config.baseURL + res.data]
      })
    })
  }

  retrieveAllImages() {
    Api().get("/getAllImages").then(res => {
      console.log(res.data)
      this.setState({
        images: res.data.map(d => `${res.config.baseURL}${d.path}`),
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
          images: [...this.state.images, ...res.data.map(f => res.config.baseURL + f)]
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  onFormSubmit(e) {
    e.preventDefault();

    console.log(this.state.file)

    const formData = new FormData();

    formData.append("myImage", this.state.file);

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    Api().post("/upload", formData, config)
      .then(res => {
        console.log("Image successfully uploaded");
        console.log(res.data);
        this.setState({
          images: [...this.state.images, res.config.baseURL + res.data]
        })
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderImage(imageSrc) {
    return (<img src={imageSrc} className="gallery"/>)
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  onChangeMulti(e) {
    this.setState({ files: [...e.target.files] });
  }

  render() {
    return (
      <div>
        {/* <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <input type="file" name="myImage" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form> */}

        <form onSubmit={this.onFormSubmitMulti}>
          <h1>File Upload Multi</h1>
          <input type="file" name="myImages" multiple="multiple" onChange={this.onChangeMulti} />
          <button type="submit">Upload</button>
        </form>

        <button onClick={this.retrieveImage}>get image</button>
        <button onClick={this.retrieveAllImages}>get all images</button>
        <div>
          <h2>My Images</h2>
          <div className="ImageGallery">
            {this.state.images.map(image => this.renderImage(image))}
          </div>
        </div>
      </div>
    );
  }
}

export default UploadImage;
