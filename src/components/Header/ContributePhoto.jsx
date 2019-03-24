import React, { Component } from 'react'
import { Button, ButtonToolbar, Modal } from 'react-bootstrap'
import '../Header/ContributePhoto.css'
import UploadPhoto from '../Header/UploadPhoto'

export default class ContributePhoto extends Component {
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         showModal: false
    //     };
    // }
    // handleShow = () => {
    //     this.setState({ showModal: !this.state.showModal });
    // }

    // handleHide = () => {
    //     this.setState({ showModal: !this.state.showModal });
    // }

    render() {
        return (
            <div className="modal-container" style={{ height: 35 }}>
                <ButtonToolbar>
                    <Button type="submit" className="contribute-photo-btn" /*(onClick={this.handleShow} */>Contribute Photo</Button>

                    {/* <Modal
                        {...this.props}
                        show={this.state.showModal}
                        onHide={this.handleHide}
                        container={this}
                        aria-labelledby="contained-modal-title"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-lg">
                                Upload your photo
                    </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <UploadPhoto />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.handleHide}>Close</Button>
                        </Modal.Footer>
                    </Modal> */}
                </ButtonToolbar>
            </div>
        )
    }
}