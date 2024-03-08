import {Button, Col, Collapse, Container, Row} from "react-bootstrap";
import '../App.css'
import React, {useEffect, useState} from "react";
import {Link, Outlet, useLocation, useNavigate} from "react-router-dom";
import {MdArrowBackIosNew, MdClose, MdInfo, MdMenu} from "react-icons/md";
import {ShareResultButton} from "../components/ShareResultButton";
import {useAppDispatch} from "../state/hooks";
import {setPage} from "../state/formSlice";
import {SaveMenuButton} from "../components/SaveMenuButton";

/**
 * The navigation bar for the application
 */
export function NavBarNew() {
    // The state of the offcanvas
    const [show, setShow] = useState(false)
    // Ensure that the offcanvas is closed when a link is clicked
    const onLinkClick = () => {
        setShow((s) => !s)
    }
    // Check if the current page is the main page
    const onMainPage = useLocation().pathname === "/"
    // The navigation hook
    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    const updateMedia = () => {
        setIsDesktop(window.innerWidth >= 768);
    };

    useEffect(() => {
        window.addEventListener('resize', updateMedia);
        return () => window.removeEventListener('resize', updateMedia);
    })


    return (
        <>
            {isDesktop &&
                <Col xs={12} className={"position-absolute text-center pt-3"} style={{fontSize: '1.5em', fontFamily: 'Arial', color: 'White', zIndex: -1}}>
                    <NavBarLogo />
                    {"Skogkurs | Kostnadskalkulator"}
                </Col>
            }
            <Container className={"justify-text-center"} style={{maxWidth: '1200px'}}>
                <Row className={"d-flex align-items-center"}>
                    {!onMainPage &&
                        <Col xs={"auto"}>
                            <NavBarButton icon={<MdArrowBackIosNew />} onClick={() => navigate(-1)} />
                        </Col>
                    }
                    <Col className={"pt-2 flex-grow-1"}
                         style={{fontSize: '1.5em', fontFamily: 'Arial', color: 'White', minWidth: 0}}>
                        {!isDesktop &&
                                <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                                    {"Kostnadskalkulator"}
                                </div>
                        }
                    </Col>
                    <Col xs={"auto"} className={"d-flex text-end"}>
                        {!onMainPage && !isDesktop &&
                            <NavBarButton icon={<MdInfo />} onClick={() => dispatch(setPage(0))} />
                        }
                        <SaveMenuButton />
                        <ShareResultButton />
                        <NavBarButton icon={!show ? <MdMenu /> : <MdClose />} onClick={onLinkClick} />
                    </Col>
                </Row>
                <Row>
                    <Collapse in={show}>
                        <Row className={"text-center"}>
                            <Link onClick={onLinkClick} to="/forskningsgrunnlag" style={{color: 'white'}}>Forskningsgrunnlag</Link>
                            <Link onClick={onLinkClick} to="/tallgrunnlag" style={{color: 'white'}}>Tallgrunnlag</Link>
                            <Link onClick={onLinkClick} to="/apiinfo" style={{color: 'white'}}>API</Link>
                            <Link onClick={onLinkClick} to="/tilbakemelding" style={{color: 'white'}}>Tilbakemelding</Link>
                        </Row>
                    </Collapse>
                </Row>
            </Container>
            <Col className={"mt-2 mx-auto ps-2 pe-2"} style={{maxWidth: '1200px'}}>
                <Outlet />
            </Col>
        </>
    )
}

function NavBarButton(props: {icon: JSX.Element, onClick: () => void}) {
    return (
        <Button
            variant={"link"}
            onClick={() => props.onClick()}
            style={{fontSize: '2em', color: "white"}}
        >
            {props.icon}
        </Button>


    )
}

/**
 * The header of the navigation bar
 */
function NavBarLogo() {
    return (
            <img
                alt="logo"
                src="logo192.png"
                width="35"
                height="35"
                className="d-inline-block align-top me-2 logo"
                style={{filter: 'brightness(0) invert(1)'}}
            />


    )
}
