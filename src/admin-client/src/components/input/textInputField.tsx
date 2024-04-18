import React from "react";
import {Form} from "react-bootstrap";

export function TextInputField(
    props: {
        value: string | undefined,
        inputHint?: string,
        onChange: (value: string, valid: boolean)=>void,
        size?: "sm" | "lg" ,
        isValid?: (text: string)=>boolean
    }
) {


    return <>
        <Form.Floating
            style={{color: '#6f7174'}}
            onPointerDown={(e)=>{e.stopPropagation()}}
            onDoubleClick={e=>{e.stopPropagation()}}
        >
            <Form.Control
                onSubmit={(e)=>{
                    e.preventDefault();
                }}
                className={"field"}
                type={"text"}
                size={props.size}
                value={props.value}
                inputMode={"text"}
                isInvalid={!(props.isValid?.(props.value ?? "") ?? true)}
                onChange={(e)=> {
                    const textIsValid = props.isValid?.(e.currentTarget.value) ?? true
                    props.onChange(e.currentTarget.value, textIsValid);
                }}
                required
            />
            <Form.Label>{props.inputHint}</Form.Label>
        </Form.Floating>
    </>
}