import React, { Component } from 'react'
import { Container, Col, Row, Image } from 'react-bootstrap'
import './Home.css'

import San_Francisco from './img/viewpoints/san-francisco-fort-funston1.jpg'
import California from './img/viewpoints/Mountains.jpg'
import Fort_Fuston from './img/viewpoints/State-provinces.jpg'
import NiagaraFalls from './img/viewpoints/niagara-falls-table-rock1.jpg'
import Paris from './img/viewpoints/Cities.jpg'
import Road5 from './img/viewpoints/road-5-tumwater-falls-park2.jpg'

import {
    Link
} from 'react-router-dom'


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animatedClass: 'not-animated'
        }
    }
    componentDidMount() {
        setTimeout(() => this.setState({
            animatedClass: 'animated'
        }), 2000);
    }

    render() {
        return (
            <div className="home-page">
                <div className="header-image">
                    <div className="header-label">
                        <Container>
                            <Row>
                                <Col xs={12} centerBlock>
                                    <h1>Search for a viewpoint</h1>
                                </Col>

                                <Col xs={12} centerBlock>
                                    <h2>Find viewpoints on your route by road number, name of a state/province, national park, landmarks, along the coast, near lake or river, in the mountains</h2>
                                </Col>

                            </Row>
                        </Container>
                    </div>

                    <div className="header-content">
                        <Container >
                            <Row>
                                <Col xs={12} className="search-bar">
                                    {this.props.children}
                                </Col>
                                <Col xs={12} className="catalog">
                                    <Link to={'/catalog'}>
                                        <div className="open-catalog">
                                            <h2 style={{ padding: '30px' }}>Explore catalog or map</h2>
                                        </div>
                                    </Link>
                                </Col>
                            </Row>

                        </Container>
                    </div>
                </div>
                <Container className="items-list">
                    <Row>
                        <Col md={4} className={`items ${this.state.animatedClass}`} >
                            <Link to={'/catalog/constructions'}>
                                <h2 >San-Francisco Bridge</h2>
                                <Image className='image' src={San_Francisco} responsive ></Image>
                            </Link>
                        </Col>
                        <Col md={4} className={`items ${this.state.animatedClass}`}>
                            <Link to={'/catalog/states-provinces/california'}>
                                <h2 >California</h2><Image className='image' src={California} responsive></Image>
                            </Link>
                        </Col>
                        <Col md={4} className={`items ${this.state.animatedClass}`}>
                            <Link to={'/catalog/states-provinces/california/san-francisco-fort-funston'}>
                                <h2 >San Francisco Fort Fuston</h2><Image className='image' src={Fort_Fuston} responsive></Image>
                            </Link>
                        </Col>
                        <Col md={4} className={`items ${this.state.animatedClass}`}>
                            <Link to={'/catalog/landmarks/niagara-falls'}>
                                <h2 >Niagara Falls</h2><Image className='image' src={NiagaraFalls} responsive></Image>
                            </Link>
                        </Col>
                        <Col md={4} className={`items ${this.state.animatedClass}`}>
                            <Link to={'/catalog'}>
                                <h2 >Paris</h2><Image className='image' src={Paris} responsive></Image>
                            </Link>
                        </Col>
                        <Col md={4} className={`items ${this.state.animatedClass}`}>
                            <Link to={'/catalog/roads/Road5'}>
                                <h2 >Road 5</h2><Image className='image' src={Road5} responsive></Image>
                            </Link>
                        </Col>

                    </Row>
                </Container>
            </div >
        )

    }

}

export default Home;