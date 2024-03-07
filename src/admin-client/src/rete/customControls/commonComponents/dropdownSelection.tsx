import {FloatingLabel, Form} from "react-bootstrap";
import React from "react";

export function DropdownSelection(
    props: {
        inputHint: string,
        dropdownAlternatives: {value: number, label: string}[],
        onChange: (alternativeIndex: number)=>void,
    }
) {
    return <>
        <FloatingLabel
            label={"Default value"}
            onPointerDown={(e)=>{e.stopPropagation()}}
            onDoubleClick={e=>{e.stopPropagation()}}
        >
            <Form.Select
                className={"field"}
                aria-label="Default select example"
                onChange={(e)=> {
                    props.onChange(parseInt(e.currentTarget.value));
                }}
            >
                {props.dropdownAlternatives.length > 0 ?
                    props.dropdownAlternatives.map((val, idx) => {
                        return <option key={idx} value={idx}>{val.label}</option>
                    })
                    :
                    <option value={0} disabled>...</option>
                }
            </Form.Select>
        </FloatingLabel>
    </>
}