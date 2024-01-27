import {Form} from "react-bootstrap";
import {DropdownProperties, FieldData} from "../constants/FieldData";
import React from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export function InputDropdown({fieldData}: {fieldData: FieldData}) {
    const dropdownItems = Array.from((fieldData.properties as DropdownProperties).options)

    return (
            <FloatingLabel label={fieldData.title} >
                <Form.Select aria-label="Default select example" className="field">
                    {dropdownItems.map(([name, value]) => <option value={value}>{name}</option>)}
                </Form.Select>
            </FloatingLabel>
    )
}