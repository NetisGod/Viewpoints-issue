
import React from 'react';

import { Breadcrumb, Container} from 'react-bootstrap';
import {
    Link
} from 'react-router-dom'

import '../Body/Breadcrumb.css';
// import { Container } from 'semantic-ui-react';

const ListBreadcrumb = (props) => {
    const { handleClose, handleToggleSwitchBtn, group, category, viewpoint } = props;

    function handleswitchBtn(event) {
        const newActiveBtn = event.target.innerText.toLowerCase();
        props.handleSwitchBtn(newActiveBtn);
    }

    const inactiveLinkStyle = {
        color: "grey",
        cursor: "auto",
        textDecoration: "none"
    }

    function back() {
        window.history.back();
    }

  
    return (
        <Container  >
            <Breadcrumb className="breadcrumb-section" style={{ backgroundColor: '#eee' }}>
                <a onClick={back}>
                    <div className="arrow-back-container">
                        <img className="arrow-back" alt="back" width="30" height="30" src="https://png.icons8.com/ios/50/7a1f5f/long-arrow-left-filled.png"></img>
                    </div>
                </a>
                <Breadcrumb.Item componentClass="span" >
                    <Link onClick={handleClose} to={'/catalog'}>Catalog</Link>
                </Breadcrumb.Item>
                {group && <Breadcrumb.Item componentClass="span">
                    <Link
                        style={!category ? inactiveLinkStyle : {}}
                        onClick={handleClose}
                        to={`/catalog/${group}`}>{group}
                    </Link>
                </Breadcrumb.Item>}
                {category && <Breadcrumb.Item componentClass="span">
                    <Link
                        style={!viewpoint ? inactiveLinkStyle : {}}
                        onClick={handleClose}
                        to={`/catalog/${group}/${category}`} >{category}
                    </Link>
                </Breadcrumb.Item>}
                {viewpoint && <Breadcrumb.Item componentClass="span">
                    <Link
                        style={inactiveLinkStyle}
                        onClick={handleClose}
                        to={`/catalog/${group}/${category}/${viewpoint}`}>{viewpoint}
                    </Link>
                </Breadcrumb.Item>}

                {props.children}

            </Breadcrumb>
        </Container>
    );
}

export default ListBreadcrumb;

