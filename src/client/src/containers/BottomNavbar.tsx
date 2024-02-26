import {Button, ButtonGroup, Col} from "react-bootstrap";
import React from "react";
import {MdFactCheck, MdHome, MdInfo, MdSpeed} from "react-icons/md";
import {IconContext} from "react-icons";
import {useLocation} from "react-router-dom";

export function BottomNavbar() {
    const location = useLocation()

    return (
        <Col className={"d-flex flex-column justify-content-center fixed-bottom align-items-center"}>
            {location.pathname === "/kalkulator" ? <Button>Test</Button> : null}
            <ButtonGroup className={"mx-auto header-color bottom-navbar"}>
                <IconContext.Provider value={{size: "2rem"}}>
                    <Button href={"#home"} className={"bottom-bar-btn"}>
                        <MdHome/>
                        Home
                    </Button>
                    <Button href={"info"} className={"bottom-bar-btn"}>
                        <MdInfo/>
                        Info
                    </Button>
                    <Button href={"#input"} className={"bottom-bar-btn"}>
                        <MdFactCheck/>
                        Input
                    </Button>
                    <Button href={"#result"} className={"bottom-bar-btn"}>
                        <MdSpeed/>
                        Result
                    </Button>
                </IconContext.Provider>
            </ButtonGroup>
        </Col>
    )
}

