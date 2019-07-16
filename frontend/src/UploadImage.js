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
    };

    this.onFormSubmitMulti = this.onFormSubmitMulti.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeMulti = this.onChangeMulti.bind(this);
    this.retrieveAllImages = this.retrieveAllImages.bind(this);
    this.renderImage = this.renderImage.bind(this);
  }

  componentDidMount = () => {
    this.retrieveAllImages();
  };

  retrieveAllImages() {
    Api().get("/getAllImages").then(res => {
      console.log(res.data)
      console.log(typeof res.data)
      this.setState({
        images: Object.keys(res.data).map(fileName => (res.config.baseURL + fileName)),
        //tags: res.data,
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
          //tags: [...this.state.tags, ...res.data],
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
        <div className="uploadSection">
          <form onSubmit={this.onFormSubmitMulti}>
            <h2 className="section">File Upload Multi</h2>
            <input type="file" name="myImages" multiple="multiple" onChange={this.onChangeMulti} />
            <button type="submit">Upload</button>
          </form>
        </div>

        <button onClick={this.retrieveAllImages}>get all images</button>
        <div>
          <h2 className="section">My Images</h2>
          <div className="imageGallery">
            <div>
              {this.state.images.map(image => this.renderImage(image))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadImage;
