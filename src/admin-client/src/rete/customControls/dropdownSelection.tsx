import {ClassicPreset} from "rete";
import {InputAlternative} from "@skogkalk/common/dist/src/parseTree/nodeMeta/input";
import {Dropdown, DropdownButton} from "react-bootstrap";
import React from "react";

export class DropdownSelectionControl extends ClassicPreset.Control {
    constructor(
        public label: string,
        public initialState: InputAlternative[],
        public onSelection: (dropdownAlternatives: InputAlternative)=> void
    ) {
        super();
    }

    setInitialState(initialState: InputAlternative[]) {
        this.initialState = initialState;
    }
}

export function DropdownSelection(
    props: {
        onSelection: (dropdownAlternatives: InputAlternative)=> void,
        inputAlternatives: InputAlternative[]
    }
) {
    const inputTest = [{name: "test", value: 0}]
    //TODO: hook for showing the dropdown
    return <>
        <DropdownButton show={true} id={"dropdown"} title={"Select"}>
            {inputTest.map((inputAlternative) => {
                return <Dropdown.Item
                    onClick={() => {
                        props.onSelection(inputAlternative);
                    }}
                >
                    {inputAlternative.name}
                </Dropdown.Item>
            })}
        </DropdownButton>
    </>
}

