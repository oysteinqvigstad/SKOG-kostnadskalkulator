import React from "react";
import {Form, InputGroup} from "react-bootstrap";
import {NumberInputNode} from "../../parseTree/nodes/inputNode";
import DOMPurify from 'dompurify';

/**
 * The input field for a numerical input
 * @param fieldData - the data for the field, including the title and properties
 */
export function InputNumberPreview({node}: {node: NumberInputNode}) {
    return (
        <>
            <Form.Floating style={{color: '#6f7174'}}>
                <Form.Control
                    className={"field"}
                    // style={{fontWeight: (fieldValue !== fieldData.default) ? 'bold' : 'normal'}}
                    placeholder="value"
                    aria-describedby={`input ${node.name}`}
                    type={"number"}
                    inputMode={"numeric"}
                    pattern="[0-9]*"
                    value={node.defaultValue}
                    required
                />
                <label>{node.name}</label>
            </Form.Floating>
            <InputGroup.Text
                className={"justify-content-center"}
                style={{width: '5rem'}}
                dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(node.unit)}}
            />
        </>
    )
}