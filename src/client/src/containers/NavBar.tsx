import {Container, Nav, Navbar, Offcanvas} from "react-bootstrap";
import '../App.css'
import React, {useState} from "react";
import {Link} from "react-router-dom";

/**
 * The navigation bar for the application
 */
export function NavBar() {
    // The state of the offcanvas
    const [show, setShow] = useState(false)
    // Ensure that the offcanvas is closed when a link is clicked
    const onLinkClick = () => setShow(false)

    return (
        <>
            <Navbar key={"sm"} expand={"sm"} className={"shadow-lg header-color"}>
                <Container fluid>
                    <NavBarHeader />
                    <Navbar.Toggle onClick={() => setShow(!show)} aria-controls={"canvas"} />
                    <Navbar.Offcanvas
                        show={show}
                        id={"canvas"}
                        aria-labelledby={"canvas"}
                        placement="end">
                        <Offcanvas.Header className={"header-color"} closeButton onClick={onLinkClick}>
                            <Offcanvas.Title id={"canvas"}>
                                {"Kostnadskalkulator"}
                            </Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body className={"header-color"}>
                            <Nav className="justify-content-end flex-grow-1 pe-3">
                                <Nav.Link as={Link} onClick={onLinkClick} to="/forskningsgrunnlag">Forskningsgrunnlag</Nav.Link>
                                <Nav.Link as={Link} onClick={onLinkClick} to="/tallgrunnlag">Tallgrunnlag</Nav.Link>
                                <Nav.Link as={Link} onClick={onLinkClick} to="/apiinfo">API</Nav.Link>
                                <Nav.Link as={Link} onClick={onLinkClick} to="/tilbakemelding">Tilbakemelding</Nav.Link>
                            </Nav>
                        </Offcanvas.Body>
                    </Navbar.Offcanvas>
                </Container>
            </Navbar>
        </>
    )

}

/**
 * The header of the navigation bar
 */
function NavBarHeader() {
   return (
       <Navbar.Brand as={Link} to="/">
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