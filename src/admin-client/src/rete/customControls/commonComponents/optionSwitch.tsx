import {Form} from "react-bootstrap";
import React from "react";


export function OptionSwitch(
    props: { on: boolean, onChange: (on: boolean)=>void }
) {
    return <>
        <Form.Floating style={{color: '#6f7174'}}>
            <Form.Switch
                className={"field"}
                label={'Simple Input'}
                checked={props.on}
                onChange={(e)=>{
                    props.onChange(e.currentTarget.checked);
                }}
                required
            />
        </Form.Floating>
    </>
}