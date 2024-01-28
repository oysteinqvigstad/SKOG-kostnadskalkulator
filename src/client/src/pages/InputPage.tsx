import {FieldData, FieldType} from "../types/FieldData";
import {InputField} from "../containers/InputField";
import {Button, Form} from "react-bootstrap";
import React, {useState} from "react";
import {FormInputErrorCode} from "../calculator/calculator-fields";
import {UnitType} from "../types/UnitTypes";

export function InputPage(props: {setPageNumber: (e: React.MouseEvent, n: number) => void}) {
    const [validated, setValidated] = useState(false)

    const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
        const form = e.currentTarget;
        if (!form.checkValidity()) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            props.setPageNumber(e, 1)
        }
        setValidated(true)
    }

    return (
        <Form noValidate onSubmit={handleSubmit} validated={validated}>
        {staticFieldDescriptions.map((data) => <InputField fieldData={data} />)}
        <div className="d-grid">
            <Button type="submit">Beregn</Button>
        </div>
        </Form>
    )
}

const staticFieldDescriptions: FieldData[] = [
    {
        type: FieldType.NUMBERED_INPUT,
        id: FormInputErrorCode.HARVESTER_HOUR_COST_G15,
        title: "Timekostnad - hogstmaskin",
        properties: { min: 0, unit: UnitType.COST_PER_G15 }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        id: FormInputErrorCode.TIMBER_TREES_1000_SQM,
        title: "Tømmertrær pr dekar",
        properties: { min: 1, unit: UnitType.TREE_PER_DEKAR }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        id: FormInputErrorCode.DRIVING_CONDITIONS,
        title: "Overflatestruktur i terrenget",
        properties: { options: new Map([
                ["Meget god", "1"],
                ["God", "2"],
                ["Middels god", "3"],
                ["Dårlig", "4"],
                ["Svært dårlig", "5"]
            ]) }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        id: FormInputErrorCode.CLEARANCE_TREES_1000_SQM,
        title: "Ryddetrær pr dekar",
        properties: { min: 0, unit: UnitType.TREE_PER_DEKAR }
    },
    {
        type: FieldType.DROPDOWN_INPUT,
        id: FormInputErrorCode.INCLINE,
        title: "Helling på hogstfeltet",
        properties: { options: new Map([
                ["0-10 %", "1"],
                ["10-20 %", "2"],
                ["20-33 %", "3"],
                ["33-50 %", "4"],
                ["> 50 %", "5"]
            ]) }
    },
    {
        type: FieldType.NUMBERED_INPUT,
        id: FormInputErrorCode.SELLABLE_TIMBER_VOLUME,
        title: "Volum pr dekar",
        properties: { min: 0, unit: UnitType.CUBIC_M_PER_DEKAR }
    },
]