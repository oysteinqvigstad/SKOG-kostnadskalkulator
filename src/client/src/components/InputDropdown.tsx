import {Col, Form, InputGroup} from "react-bootstrap";
import {DropdownProperties, FieldData} from "../constants/FieldData";
import {InfoCircle} from "react-bootstrap-icons";
import React from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";

export function InputDropdown({fieldData}: {fieldData: FieldData}) {
    return (
        <InputGroup className="mb-3">
            <InputGroup.Text>
                <InfoCircle />
            </InputGroup.Text>
            <FloatingLabel label={fieldData.title} >
                <Form.Select aria-label="Default select example">
                    {Array.from((fieldData.properties as DropdownProperties).options).map(([name, value]) => {
                            return <option value={value}>{name}</option>
                        })
                }
                </Form.Select>
            </FloatingLabel>
        </InputGroup>


    )
}