import React from 'react'
import { Navbar, NavDropdown, Form, FormControl, Button, Nav, Tooltip, OverlayTrigger } from 'react-bootstrap'

import '../Header/NavBar.css'

import { Link } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css';
import ContributePhoto from '../Header/ContributePhoto'

export const NavBar = (props) => {
    return <Navbar className="navigation" fixed="top" expand="sm">
        <Navbar.Brand className="navbar-brand-header"><Link to={`/`} >World Top Viewpoints</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end ">
            <Nav className="mr-auto">

            </Nav>
            <Form inline className="search-form">
                {props.children}
            </Form>
            <OverlayTrigger
                key={'bottom'}
                placement={'bottom'}
                overlay={
                    <Tooltip id={`tooltip-${'bottom'}`}>
                        Will be developed soon...
        </Tooltip>
                }
            >

                <Form inline className="contribute-form">
                    <ContributePhoto />
                </Form>
            </OverlayTrigger>

        </Navbar.Collapse>
    </Navbar>


};