import React from 'react';
import '../Body/List.css';
import { Container, Row, Col, Carousel, Button, Card } from 'react-bootstrap';
import {
    Link
} from 'react-router-dom'

import { HelperListImages } from '../../Helper'
import ListBreadcrumb from '../Body/Breadcrumb'

const List = (props) => {

    function handleClose() {
        props.handleCloseItem();
    }

    function handleClick() {
        if (!props.viewpoint) return;
        props.handleOpenItem();
    }



    const Iframe = (props) => (
        <div style={{ position: 'relative' }}>
            <iframe
                title={props.src}
                src={props.src}
                // style={{ width: '100%', height: '30vw' }}
                allowfullscreen
            >
            </iframe>
            <div className='gallery-image-pano-icon'></div>
        </div>
    )

    return (
        <div>
            <div className={'list-container'}>
                <Container className='container'>
                    <Row>
                        <Col sm={12}>

                            {props.isItemClicked &&
                                props.data.map((d) => {

                                    return (
                                        <Col key={d.id} index={d.id} sm={12} >
                                            <Card bsStyle='primary' className="list-panel list-panel-active" >
                                                <Card.Header>
                                                    <Card.Title componentClass="h3" className='primary'>{d.title}</Card.Title>
                                                    <Button className="btn-close" onClick={handleClose}>
                                                        <svg width="8" version="1.1" xmlns="http://www.w3.org/2000/svg" height="8" viewBox="0 0 64 64" xlinkHref="http://www.w3.org/1999/xlink" enable-background="new 0 0 64 64">
                                                            <g>
                                                                <path fill="#1D1D1B" d="M28.941,31.786L0.613,60.114c-0.787,0.787-0.787,2.062,0,2.849c0.393,0.394,0.909,0.59,1.424,0.59   c0.516,0,1.031-0.196,1.424-0.59l28.541-28.541l28.541,28.541c0.394,0.394,0.909,0.59,1.424,0.59c0.515,0,1.031-0.196,1.424-0.59   c0.787-0.787,0.787-2.062,0-2.849L35.064,31.786L63.41,3.438c0.787-0.787,0.787-2.062,0-2.849c-0.787-0.786-2.062-0.786-2.848,0   L32.003,29.15L3.441,0.59c-0.787-0.786-2.061-0.786-2.848,0c-0.787,0.787-0.787,2.062,0,2.849L28.941,31.786z" />
                                                            </g>
                                                        </svg>
                                                    </Button>
                                                </Card.Header>
                                                <Carousel interval={100000} indicators={false}>
                                                    {d.images.map((image) => {
                                                        if (!image.iframe) {

                                                            return (<Carousel.Item key={image.name}>
                                                                <HelperListImages
                                                                    img={image.name}
                                                                    className="active-img"
                                                                    // style={{ width: '100%', height: '30vw' }}
                                                                    providedby={image.providedBy}
                                                                />
                                                            </Carousel.Item>);
                                                        } else {
                                                            return (<Carousel.Item>
                                                                <Iframe src={image.url} />
                                                            </Carousel.Item>);
                                                        }
                                                    })}
                                                </Carousel>
                                            </Card>
                                        </Col>
                                    )

                                })
                            }
                        </Col>
                        {!props.isItemClicked &&
                            props.data.map((d) => {
                                let tags;
                                tags = (d.group ? 'group' : 'categories');
                                return (
                                    <Col lg={6} id={d.id} >
                                        <Card bsStyle='primary' className="list-panel" >
                                            <Link to={props.viewpoint ? `${props.route}` : `${props.route}/${d.identifier || d.groupLabel}`} onClick={handleClick}>
                                                <Card.Header>
                                                    <Card.Title componentClass="h3" className='primary'
                                                        style={{
                                                            color: "white"
                                                        }}>{d.title}</Card.Title>
                                                </Card.Header>

                                                <h1 className="char-name">
                                                    <HelperListImages
                                                        img={d.imageTitle ? d.imageTitle : d.images[0].name}
                                                        className="char-name-img"
                                                        providedby={d.groupLabel ? '' : (d.imageProvidedBy ? d.imageProvidedBy : d.images[0].providedBy)}
                                                    />
                                                </h1>
                                            </Link>
                                            {d.location && <a
                                                style={{
                                                    display: "block",
                                                    textAlign: "center",
                                                    fontSize: "1.7vh",
                                                    marginTop: "4px",
                                                    marginBottom: "4px",
                                                    color: "white"
                                                }}
                                                href={`http://maps.google.com/maps?daddr=${d.location[1]},${d.location[0]}`}
                                                target="_blank"
                                            >Get direction
                             </a>}
                                        </Card>
                                        <Container className="grid-tags">
                                            <Row >
                                                {(d.categories || d.group) && d[tags].map((tag) => {
                                                    return (
                                                        // <Col key={tag} xs={4} className="">
                                                        <Button className="tag-container" bsStyle="success">
                                                            <Link to={d.categories ? `/catalog/categories/${tag}` : `/catalog/${tag}`}>
                                                                {tag}
                                                            </Link>
                                                        </Button>
                                                        // </Col>
                                                    );

                                                })}
                                            </Row>
                                        </Container>
                                    </Col>

                                )

                            })
                        }

                    </Row>
                </Container>
            </div >
        </div>
    );
}

export default List;