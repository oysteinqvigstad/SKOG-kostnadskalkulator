import React, {useState} from "react";
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
    const [value, setValue] =
        useState(props.value ?? "");
    const [valid, setValid] =
        useState(props.isValid?.(props.value ?? "") ?? true);



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
                value={value}
                inputMode={"text"}
                isInvalid={!valid}
                onChange={(e)=> {
                    const textIsValid = props.isValid?.(e.currentTarget.value) ?? true
                    props.onChange(e.currentTarget.value, textIsValid);
                    setValid(textIsValid)
                    setValue(e.currentTarget.value);
                }}
                required
            />
            <Form.Label>{props.inputHint}</Form.Label>
        </Form.Floating>
    </>
}