import React from "react";
import {Form} from "react-bootstrap";


export function isInRange(value: number, range: {min?: number, max?: number}) {
    return (range.min === undefined || value >= range.min) && (range.max === undefined || value <= range.max);
}

export function getLegalValueInRange(value: number, range: {min?: number, max?: number}) {
    if(range.min !== undefined && value < range.min) {
        return range.min;
    }
    if(range.max !== undefined && value > range.max) {
        return range.max;
    }
    return value;
}

export function NumberInputField(
    props: {
        inputHint: string,
        value: number | undefined,
        onChange?: (value: number)=>void,
        onIllegalValue?: (value: number)=>void,
        legalRanges?: readonly {min?: number, max?: number}[],
        disabled?: boolean,
        isValid?: (value: number)=>boolean
    }
) {

    return <>
        <Form.Floating
            style={{color: '#6f7174'}}
            onPointerDown={(e)=>{e.stopPropagation()}}
            onDoubleClick={e=>{e.stopPropagation()}}
        >
            <Form.Control
                value={props.value}
                className={"field"}
                placeholder="0"
                type={"number"}
                disabled={props.disabled}
                readOnly={props.onChange === undefined}
                inputMode={"numeric"}
                pattern="[0-9]*"
                required = {true}
                isInvalid={props.isValid !== undefined && !props.isValid(props.value ?? 0)}
                onChange={(e)=>{
                    const value = parseFloat(e.currentTarget.value);
                    if(props.legalRanges === undefined || props.legalRanges?.length === 0 || props.legalRanges?.some(({min, max}) => {
                        return isInRange(value, {min, max})
                    })) {
                        props.onChange?.(value);
                        return;
                    }
                    props.onIllegalValue?.(value);
                }}
            />
            {props.inputHint === "" ? null : <label>{props.inputHint}</label>}
        </Form.Floating>
    </>
}