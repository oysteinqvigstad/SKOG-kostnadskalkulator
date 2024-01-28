import {Container, Nav, Navbar, Offcanvas} from "react-bootstrap";
import '../App.css'
import React from "react";

export function NavBar() {
    return (
        <>
            <Navbar key={"sm"} expand={"sm"} className={"shadow-lg header-color"}>
                <Container fluid>
                    <NavBarHeader />
                    <Navbar.Toggle aria-controls={"canvas"} />
                    <Navbar.Offcanvas
                        id={"canvas"}
                        aria-labelledby={"canvas"}
                        placement="end">
                        <Offcanvas.Header className={"header-color"} closeButton>
                            <Offcanvas.Title id={"canvas"}>
                                {"Kostnadskalkulator"}
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className={"header-color"}>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link href="">Forskningsgrunnlag</Nav.Link>
                                <Nav.Link href="">API</Nav.Link>
                                <Nav.Link href="">Tilbakemelding</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    )

}

function NavBarHeader() {
   return (
       <Navbar.Brand href="#home">
           <img
               alt="logo"
               src="logo32.png"
               width="32"
               height="32"
               className="d-inline-block align-top me-2"/>
           {"Kostnadskalkulator"}
       </Navbar.Brand>
   )
}