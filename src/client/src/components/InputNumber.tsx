import React from "react";
import {Form, InputGroup} from "react-bootstrap";
import {FieldData, NumberedProperties} from "../types/FieldData";
import '../App.css'
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {setField} from "../state/formSlice";

/**
 * The input field for a numerical input
 * @param fieldData - the data for the field, including the title and properties
 */
export function InputNumber({fieldData}: {fieldData: FieldData}) {
    // Get the properties of the field
    const props = fieldData.properties as NumberedProperties
    // Get the default value for the field from the store
    const data = useAppSelector((state) => state.form.fields[fieldData.title])
    // Get the dispatch function from the store
    const dispatch = useAppDispatch()

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
                    value={data}
                    onChange={e => dispatch(setField({title: fieldData.title, value: e.target.value}))}
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