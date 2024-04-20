import {FloatingLabel, FormSelect} from "react-bootstrap";
import React from "react";

export function DropdownSelection(
    props: {
        inputHint: string,
        selection?: number,
        dropdownAlternatives: {value: number, label: string}[],
        onChange: (alternativeIndex: number)=>void,
    }
) {
    return <>
        <FloatingLabel
            label={props.inputHint}
            onPointerDown={(e)=>{e.stopPropagation()}}
            onDoubleClick={e=>{e.stopPropagation()}}
        >
            <FormSelect
                className={"field"}
                aria-label="Default select example"
                value={props.selection}
                onChange={(e)=> {
                    props.onChange(parseInt(e.currentTarget.value));
                }}

            >
                <option value={undefined} >...</option>
                {props.dropdownAlternatives.length > 0 ?
                    props.dropdownAlternatives.map((val, idx) => {
                        return <option key={idx} value={idx}>{val.label}</option>
                    })
                    :
                    <option value={0} disabled>...</option>
                }
            </FormSelect>
        </FloatingLabel>
    </>
}