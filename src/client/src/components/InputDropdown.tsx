import {Form, FloatingLabel} from "react-bootstrap";
import {DropdownProperties, FieldData} from "../types/FieldData";
import React from "react";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {setField} from "../state/formSlice";

/**
 * The input field for a dropdown input
 * @param fieldData - the data for the field, including the title and properties
 */
export function InputDropdown({fieldData}: {fieldData: FieldData}) {
    // Get the properties of the field
    const dropdownItems = Array.from((fieldData.properties as DropdownProperties).options)
    // Get the default value for the field from the store
    const data = useAppSelector((state) => state.form.fields[fieldData.title])
    // Get the dispatch function from the store
    const dispatch = useAppDispatch()

    return (
            <FloatingLabel label={fieldData.title} >
                <Form.Select
                    aria-label={`dropdown ${fieldData.title}`}
                    className="field"
                    value={data ?? ""}
                    onChange={e => dispatch(setField({title: fieldData.title, value: e.target.value}))}>
                    <option value="" disabled>Velg et alternativ</option>
                    {dropdownItems.map(([name, value]) => <option value={value}>{name}</option>)}
                </Form.Select>
            </FloatingLabel>
    )
}