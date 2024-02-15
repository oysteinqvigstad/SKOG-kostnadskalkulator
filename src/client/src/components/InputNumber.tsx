import React from "react";
import {Button, Form, InputGroup} from "react-bootstrap";
import {FieldData, NumberedProperties} from "../types/FieldData";
import '../App.css'
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {setField} from "../state/formSlice";
import {MdReplay} from "react-icons/md";

/**
 * The input field for a numerical input
 * @param fieldData - the data for the field, including the title and properties
 */
export function InputNumber({fieldData}: {fieldData: FieldData}) {
    // Get the properties of the field
    const props = fieldData.properties as NumberedProperties
    // Get the default value for the field from the store
    const fieldValue = useAppSelector((state) => state.form.fields[fieldData.title])
    // whole form has been validated
    const formValidated = useAppSelector((state) => state.form.validated)
    // Get the dispatch function from the store
    const dispatch = useAppDispatch()
    // callback function for changing input value
    const onChange = (e: React.ChangeEvent<any>) => {
        dispatch(setField({title: fieldData.title, value: e.target.value}))
    }


    return (
        <>
            <Form.Floating style={{color: '#6f7174'}}>
                <Form.Control
                    className={"field"}
                    style={{fontWeight: (fieldValue !== fieldData.default) ? 'bold' : 'normal'}}
                    placeholder="value"
                    aria-describedby={`input ${fieldData.title}`}
                    type={"number"}
                    inputMode={"numeric"}
                    pattern="[0-9]*"
                    min={props.min}
                    value={fieldValue}
                    isInvalid={isNaN(parseInt(fieldValue))}
                    onChange={e => onChange(e)}
                    required
                />
                <label>{fieldData.title}</label>
            </Form.Floating>
            <Button
                onClick={() => dispatch(setField({title: fieldData.title, value: fieldData.default ?? ""}))}
                hidden={fieldValue === fieldData.default}
                className={"reset-button"}
                style={{
                    position: 'absolute',
                    right: (isNaN(parseInt(fieldValue)) || formValidated) ? '100px' : '80px',
                    zIndex: 5,
                    border: 'none',
                    top: '11%',
            }}
            >
                <MdReplay />
            </Button>

            <InputGroup.Text
                className={"justify-content-center"}
                style={{width: '5rem'}}>
                    {props.unit}
            </InputGroup.Text>
        </>
    )
}