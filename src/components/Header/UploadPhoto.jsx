import React, { Component } from 'react'

export default class UploadPhoto extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null
        };
    }
    onFileSelectedHendler = event => {
        this.setState({ selectedFile: event.target.files[0] });
    }
    onFileUploadHandler = event => {
        const fd = new FormData();
        // const url = 'http://requestbin.fullcontact.com/1dpebm11';
        fd.append('iamge', this.state.selectedFile);
    }

    render() {
        return (
            <div className={"input-group mb-3"}>
                <div className={"input-group-prepend"}>
                    <button className={"btn btn-outline-secondary"} type="button" onClick={this.onFileUploadHandler}>Upload</button>
                </div>
                <div className={"custom-file"}>
                    <input type="file" className={"custom-file-input file"} id="inputGroupFile01" onChange={this.onFileSelectedHendler} />
                    <label className={"custom-file-label"} htmlFor="inputGroupFile01">Choose file</label>
                </div>
            </div>
        )
    }
}