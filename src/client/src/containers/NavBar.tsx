import {Col, Container, Nav, Navbar, Offcanvas} from "react-bootstrap";
import '../App.css'
import React, {useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {MdArrowBackIosNew, MdClose, MdMenu} from "react-icons/md";
import {MainContainer} from "./MainContainer";

/**
 * The navigation bar for the application
 */
export function NavBar() {
    // The state of the offcanvas
    const [show, setShow] = useState(false)
    // Ensure that the offcanvas is closed when a link is clicked
    const onLinkClick = () => setShow((s) => !s)
    // Check if the current page is the main page
    const onMainPage = useLocation().pathname === "/"
    // The navigation hook
    const navigate = useNavigate()

    // The options for the buttons
    const buttonOptions = {
        onClick: onLinkClick,
        cursor: 'pointer',
        fontSize: '1.8em',
        width: '3em',
        color: '#004f59'
    }

    return (
        <>
            <Navbar key={"sm"} expand={"true"} className={"shadow-lg header-color"}>
                <Container style={{maxWidth: '820px'}}>
                    <Col xs={1}>
                        {!onMainPage && <MdArrowBackIosNew {...buttonOptions} onClick={() => navigate(-1)} />}
                    </Col>
                    <Col xs={"auto"}>
                        <NavBarHeader />
                    </Col>
                    <Col xs={1} className={"text-end"}>
                        {show ? <MdClose {...buttonOptions} /> : <MdMenu {...buttonOptions} />}
                    </Col>

                </Container>
                <Offcanvas
                    show={show}
                    onHide={onLinkClick}
                    id={"canvas"}
                    aria-labelledby={"canvas"}
                    placement="end">
                    <Offcanvas.Header closeButton className={"header-color"}>
                        <Offcanvas.Title id={"canvas"}>
                            {"Kostnadskalkulator"}
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className={"header-color"}>
                        <Nav className="justify-content-end pe-3">
                            <Nav.Link as={Link} onClick={onLinkClick} to="/forskningsgrunnlag">Forskningsgrunnlag</Nav.Link>
                            <Nav.Link as={Link} onClick={onLinkClick} to="/tallgrunnlag">Tallgrunnlag</Nav.Link>
                            <Nav.Link as={Link} onClick={onLinkClick} to="/apiinfo">API</Nav.Link>
                            <Nav.Link as={Link} onClick={onLinkClick} to="/tilbakemelding">Tilbakemelding</Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Offcanvas>
            </Navbar>
            <MainContainer>
                <Outlet />
            </MainContainer>
        </>
    )

}

/**
 * The header of the navigation bar
 */
function NavBarHeader() {
   return (
       <Navbar.Brand as={Link} to="/" className={"m-auto"}>
           <img
               alt="logo"
               src="logo32.png"
               width="32"
               height="32"
               className="d-inline-block align-top me-2"/>
           {"Skogskalkulatorer"}
       </Navbar.Brand>
   )
}