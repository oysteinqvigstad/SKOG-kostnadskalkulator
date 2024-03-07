import {ResultCard} from "./ResultCard";
import {FcMultipleInputs} from "react-icons/fc";
import React from "react";
import {ParametersWithTabs} from "../ParametersWithTabs";
import {Dropdown, Form} from "react-bootstrap";
import {MdReplay, MdTune} from "react-icons/md";
import {useAppDispatch, useAppSelector} from "../../state/hooks";
import {resetAllFields, toggleHideAdvanced} from "../../state/formSlice";

export function ResultParameters() {

    const dispatch = useAppDispatch()
    const hideAdvanced = useAppSelector((state) => state.form.hideAdvanced)


    const left =(
        <Dropdown id={"field-settings"} autoClose={"outside"} align={{xs: 'start'}}>
            <Dropdown.Toggle>
                <MdTune fontSize={'1.2em'} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item
                    onClick={() => dispatch(resetAllFields())}
                >
                    <MdReplay fontSize={'1.2em'} className={'ms-1 me-3'}/>
                    {"Nullstill alle felt"}
                </Dropdown.Item>
                <Dropdown.Item
                    onClick={() => dispatch(toggleHideAdvanced())}
                >
                    <Form.Check
                        type={"switch"}
                        label={"Skjul avanserte felt"}
                        checked={hideAdvanced}
                    />
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )


    return (
        <ResultCard
            icon={<FcMultipleInputs />}
            title={"Kostnadsdrivere"}
            left={left}
        >
            <ParametersWithTabs />
        </ResultCard>
    )
}
