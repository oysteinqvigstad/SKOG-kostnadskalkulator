import {Form, FloatingLabel, Button} from "react-bootstrap";
import {DropdownProperties, FieldData} from "../types/FieldData";
import React from "react";
import {useAppDispatch, useAppSelector} from "../state/hooks";
import {setField} from "../state/formSlice";
import {MdReplay} from "react-icons/md";

/**
 * The input field for a dropdown input
 * @param fieldData - the data for the field, including the title and properties
 */
export function InputDropdown({fieldData}: {fieldData: FieldData}) {
    // Get the properties of the field
    const dropdownItems = Array.from((fieldData.properties as DropdownProperties).options)
    // Get the default value for the field from the store
    const fieldValue = useAppSelector((state) => state.form.fields[fieldData.title])
    // Get the dispatch function from the store
    const dispatch = useAppDispatch()
    // whole form has been validated
    const formValidated = useAppSelector((state) => state.form.validated)

    const onChange = (e: React.ChangeEvent<any>) => {
        dispatch(setField({title: fieldData.title, value: e.target.value}))
        e.target.blur()
        e.currentTarget.blur()
    }

    return (
            <FloatingLabel label={fieldData.title} >
                <Form.Select
                    aria-label={`dropdown ${fieldData.title}`}
                    className="field"
                    // style={{fontWeight: (fieldValue !== fieldData.default) ? 'bold' : 'normal'}}
                    value={fieldValue ?? ""}
                    onChange={onChange}>
                    <option value="" disabled>Velg et alternativ</option>
                    {dropdownItems.map(([name, value]) => <option value={value}>{name}</option>)}
                </Form.Select>
                <Button
                    onClick={() => dispatch(setField({title: fieldData.title, value: fieldData.default ?? ""}))}
                    hidden={fieldValue === fieldData.default}
                    className={"reset-button"}
                    style={{
                        position: 'absolute',
                        right: (isNaN(parseInt(fieldValue)) || formValidated) ? '50px' : '25px',
                        border: 'none',
                        top: '11%',
                    }}
                >
                    <MdReplay />
                </Button>
            </FloatingLabel>

    )
}