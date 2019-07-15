import React from "react";
import Api from './services/Api';
import './UploadImage.css';

class UploadImage extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      file: null,
      images: [],
    };

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.retrieveImage = this.retrieveImage.bind(this);
    this.renderImage = this.renderImage.bind(this);
  }

  retrieveImage() {
    Api().get("/getImage").then(res => {
      console.log(res)
      this.setState({
        images: [...this.state.images, res.config.baseURL + res.data]
      })
    })
  }

  onFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("myImage", this.state.file);

    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    Api().post("/upload", formData, config)
      .then(res => {
        console("Image successfully uploaded");
      })
      .catch(error => {
        console.log(error)
      });
  }

  renderImage(imageSrc) {
    return (<img src={imageSrc} className="gallery"/>)
  }

  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
          <h1>File Upload</h1>
          <input type="file" name="myImage" onChange={this.onChange} />
          <button type="submit">Upload</button>
        </form>
        <button onClick={this.retrieveImage}>get image</button>
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
