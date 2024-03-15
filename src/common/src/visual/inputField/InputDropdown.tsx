import {Form, FloatingLabel, Button} from "react-bootstrap";
import React from "react";
import {MdReplay} from "react-icons/md";
import {DropdownInput} from "../../parseTree";

/**
 * The input field for a dropdown input
 * @param fieldData - the data for the field, including the title and properties
 */
export function InputDropdownPreview({node}: {node: DropdownInput}) {


    return (
            <FloatingLabel label={node.name} >
                <Form.Select
                    aria-label={`dropdown ${node.name}`}
                    className="field"
                    value={node.dropdownAlternatives[0]?.label ?? ""}>
                    <option value="" disabled>Velg et alternativ</option>
                    {node.dropdownAlternatives.map(({value, label}) => <option value={value}>{label}</option>)}
                </Form.Select>
                <Button
                    onClick={() => {}}
                    hidden={node.value === node.defaultValue}
                    className={"reset-button"}
                    style={{
                        position: 'absolute',
                        right: '25px',
                        border: 'none',
                        top: '11%',
                    }}
                >
                    <MdReplay />
                </Button>
            </FloatingLabel>

    )
}