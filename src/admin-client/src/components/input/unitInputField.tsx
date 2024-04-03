import React from "react"
import {Button, Form} from "react-bootstrap"

export function UnitInputField(props: {
    value: string,
    inputHint?: string,
    onChange: (value: string) => void,
}) {
    //TODO: Remove mock superscript
    const html = props.value + '<sup>2</sup>'

    return <>
        <Form.Floating style={{}}>
            <Form.Control
                onSubmit={(e)=> {e.preventDefault()} }
                className={"field"}
                type={"text"}
                value={props.value}
                onChange={(e) => {
                    props.onChange(e.currentTarget.value);
                }}
            />
            <Form.Control
                as="div"
                dangerouslySetInnerHTML={{__html: html}}
            />
            <Form.Label>{props.inputHint}</Form.Label>
        </Form.Floating>
        </>
        }

