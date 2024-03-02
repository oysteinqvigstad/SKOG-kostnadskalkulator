import {ClassicPreset} from "rete";
import {Dropdown, DropdownButton} from "react-bootstrap";
import React from "react";

export class DropdownSelectionControl extends ClassicPreset.Control {
    constructor(
        public label: string,
        public initialState: {label: string, value: number}[],
        public onSelection: (dropdownAlternatives: {label: string, value: number})=> void
    ) {
        super();
    }

    setInitialState(initialState: {label: string, value: number}[]) {
        this.initialState = initialState;
    }
}

export function DropdownSelection(
    props: {
        onSelection: (dropdownAlternatives: {label: string, value: number})=> void,
        inputAlternatives: {label: string, value: number}[]
    }
) {
    const inputTest = [{label: "test", value: 0}]
    //TODO: hook for showing the dropdown
    return <>
        <DropdownButton show={true} id={"dropdown"} title={"Select"}>
            {inputTest.map((inputAlternative) => {
                return <Dropdown.Item
                    onClick={() => {
                        props.onSelection(inputAlternative);
                    }}
                >
                    {inputAlternative.label}
                </Dropdown.Item>
            })}
        </DropdownButton>
    </>
}

