import {Form, FloatingLabel} from "react-bootstrap";
import {DropdownProperties, FieldData} from "../types/FieldData";
import React from "react";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {setField} from "../state/formSlice";

export function InputDropdown({fieldData}: {fieldData: FieldData}) {
    const dropdownItems = Array.from((fieldData.properties as DropdownProperties).options)

    const data = useAppSelector((state) => state.form.fields[fieldData.title])
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