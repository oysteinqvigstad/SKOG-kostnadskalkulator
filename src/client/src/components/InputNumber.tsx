import React from "react";
import {Form, InputGroup} from "react-bootstrap";
import {FieldData, NumberedProperties} from "../types/FieldData";
import '../App.css'

export function InputNumber({fieldData}: {fieldData: FieldData}) {
    const props = fieldData.properties as NumberedProperties

    return (
        <>
            <Form.Floating style={{color: '#6f7174'}}>
                <Form.Control
                    className={"field"}
                    placeholder="value"
                    aria-describedby={`input ${fieldData.title}`}
                    type="number"
                    inputMode={"numeric"}
                    pattern="[0-9]*"
                    min={props.min}
                    required
                />
                <label>{fieldData.title}</label>
            </Form.Floating>
            <InputGroup.Text
                className={"justify-content-center"}
                style={{width: '5rem'}}>
                    {props.unit}
            </InputGroup.Text>
        </>
    )
}