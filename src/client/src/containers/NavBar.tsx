import {Container, Nav, Navbar, Offcanvas} from "react-bootstrap";
import React, {Key} from "react";

export function NavBar() {
    return (
        <>
            {['sm'].map((expand) => (
                <Navbar key={expand as Key} expand={expand} style={{background: "#e9f0ec"}}>
                    <Container fluid>
                            <Navbar.Brand href="#home">
                            <img
                            alt=""
                            src="logo32.png"
                            width="32"
                            height="32"
                            className="d-inline-block align-top me-2"
                            />
                            Kostnadskalkulator
                            </Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                        >
                            <Offcanvas.Header style={{background: "#e9f0ec"}} closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    Meny
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body style={{background: "#e9f0ec"}}>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link href="">Ressurs 1</Nav.Link>
                                    <Nav.Link href="">Ressurs 2</Nav.Link>
                                    <Nav.Link href="">Ressurs 3</Nav.Link>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}
        </>
    )
    // return (
    //        <>
    //            <Navbar style={{background: "#e9f0ec"}}>
    //                <Container>
    //                    <Navbar.Brand href="#home">
    //                        <img
    //                            alt=""
    //                            src="logo192.png"
    //                            width="30"
    //                            height="30"
    //                            className="d-inline-block align-top"
    //                        />{' '}
    //                        Kostnadskalkulator
    //                    </Navbar.Brand>
    //                </Container>
    //
    //
    //            </Navbar>
    //        </>
    // )
}