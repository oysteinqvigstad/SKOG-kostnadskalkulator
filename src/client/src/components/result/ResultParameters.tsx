import {ResultCard} from "./ResultCard";
import {FcMultipleInputs} from "react-icons/fc";
import React from "react";
import {ParametersWithTabs} from "../ParametersWithTabs";
import {Dropdown} from "react-bootstrap";
import {MdReplay, MdTune} from "react-icons/md";

export function ResultParameters() {

    return (
        <ResultCard
            icon={<FcMultipleInputs />}
            title={"Kostnadsdrivere"}
            left={<SettingsPane />}
        >
            <ParametersWithTabs />
        </ResultCard>
    )
}


function SettingsPane() {

    return (
        <Dropdown id={"field-settings"} autoClose={"outside"} align={{xs: 'start'}}>
            <Dropdown.Toggle>
                <MdTune fontSize={'1.2em'}/>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item
                    onClick={() => {}}
                >
                    <MdReplay fontSize={'1.2em'} className={'ms-1 me-3'}/>
                    {"Tilbakestill alle felt"}
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}