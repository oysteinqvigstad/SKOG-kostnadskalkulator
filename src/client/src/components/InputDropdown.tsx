import {Form, FloatingLabel} from "react-bootstrap";
import {DropdownProperties, FieldData} from "../types/FieldData";
import React from "react";

export function InputDropdown({fieldData}: {fieldData: FieldData}) {
    const dropdownItems = Array.from((fieldData.properties as DropdownProperties).options)

    return (
            <FloatingLabel label={fieldData.title} >
                <Form.Select aria-label={`dropdown ${fieldData.title}`} className="field">
                    {dropdownItems.map(([name, value]) => <option value={value}>{name}</option>)}
                </Form.Select>
            </FloatingLabel>
    )
}