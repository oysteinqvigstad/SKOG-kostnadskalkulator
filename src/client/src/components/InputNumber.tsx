import React from "react";
import {Form, InputGroup} from "react-bootstrap";
import {FieldData, NumberedProperties} from "../constants/FieldData";
import '../App.css'

export function InputNumber({fieldData}: {fieldData: FieldData}) {
    return (
        <>
            <Form.Floating
                style={{color: '#6f7174'}}>
                <Form.Control
                    type="text"
                    placeholder="value"
                    aria-describedby="basic-addon1"
                    className={"field"}
                />
                <label htmlFor="floatingInputCustom">{fieldData.title}</label>
            </Form.Floating>
            <InputGroup.Text className={"justify-content-center"} style={{width: '5rem'}} >{(fieldData.properties as NumberedProperties).unit}</InputGroup.Text>
        </>
    )
}