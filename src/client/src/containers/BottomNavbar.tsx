import {Button, ButtonGroup} from "react-bootstrap";
import React from "react";
import {MdFactCheck, MdHome, MdInfo, MdSpeed} from "react-icons/md";
import {IconContext} from "react-icons";

export function BottomNavbar() {
    return (

        <ButtonGroup className={"mx-auto fixed-bottom header-color bottom-navbar"}>
            <IconContext.Provider value={{size: "2rem"}}>
                <Button href={"#info"} className={"bottom-bar-btn"}>
                    <MdInfo/>
                    Info
                </Button>
                <Button href={"#home"} className={"bottom-bar-btn"}>
                    <MdHome/>
                    Home
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

    )
}

