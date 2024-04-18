import {ResultCard} from "./ResultCard";
import {FcMultipleInputs} from "react-icons/fc";
import React from "react";
import {ParametersWithTabs} from "../ParametersWithTabs";
import {Dropdown, Form} from "react-bootstrap";
import {MdReplay, MdTune} from "react-icons/md";
import {useAppDispatch, useAppSelector} from "../../state/hooks";
import {resetAllFields, toggleHideAdvanced} from "../../state/formSlice";

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
    const dispatch = useAppDispatch()
    const hideAdvanced = useAppSelector((state) => state.form.hideAdvanced)

    return (
        <Dropdown id={"field-settings"} autoClose={"outside"} align={{xs: 'start'}}>
            <Dropdown.Toggle>
                <MdTune fontSize={'1.2em'}/>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item
                    onClick={() => dispatch(resetAllFields())}
                >
                    <MdReplay fontSize={'1.2em'} className={'ms-1 me-3'}/>
                    {"Tilbakestill alle felt"}
                </Dropdown.Item>
                <Dropdown.Item as={"div"}>
                    <Form.Check
                        type={"switch"}
                        label={"Skjul avanserte felt"}
                        id={"advanced-switch"}
                        checked={hideAdvanced}
                        onChange={() => dispatch(toggleHideAdvanced())}
                    />
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}