import React from 'react';
import '../Footer/Footer.css';
import { Container, Row, Col } from 'react-bootstrap';
import {
    Link
} from 'react-router-dom'

const Footer = () => {
    return (
        <div className="footer-container">
            <Container>
                <Row>
                    <Col sm={3}>
                        <h4><Link to={`/catalog`}>Popular Photos</Link></h4>
                    </Col>

                    <Col sm={2}>
                        <h4><Link to={`/catalog`}>Popular Viewpoints</Link></h4>
                    </Col>

                    <Col sm={2}>
                        <h4><Link to={`/catalog`}>Popular Locations</Link></h4>
                    </Col>

                    <Col sm={2}>
                        <h4><Link to={`/catalog`}>Popular Cities</Link></h4>
                    </Col>

                    <Col sm={3}>
                        <h4><Link to={`/catalog`}>Popular Countries</Link></h4>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;
