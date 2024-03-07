import React, {useState} from "react";
import {Form} from "react-bootstrap";

export function TextInputField(
    props: { value: string | undefined, inputHint: string, onChange: (value: string)=>void }
) {
    const [value, setValue] = useState(props.value);

    return <>
        <Form.Floating
            style={{color: '#6f7174'}}
            onPointerDown={(e)=>{e.stopPropagation()}}
            onDoubleClick={e=>{e.stopPropagation()}}
        >
            <Form.Control
                className={"field"}
                type={"text"}
                value={value}
                inputMode={"text"}
                onChange={(e)=>{
                    props.onChange(e.currentTarget.value);
                    setValue(e.currentTarget.value);
                }}
                required
            />
            <label>{props.inputHint}</label>
        </Form.Floating>
    </>

}