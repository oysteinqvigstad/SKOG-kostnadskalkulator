import {Provider} from "react-redux";
import {store} from "../../../state/store";
import {ChooseNodeComparisonData, ChooseNodeControlData} from "./ChooseNodeControlData";
import {NodeControl} from "../nodeControl";
import {Button, FloatingLabel, FormSelect, InputGroup} from "react-bootstrap";
import {Drag} from "rete-react-plugin";
import {Comparison} from "@skogkalk/common/dist/src/parseTree";
import React from "react";
import {NumberInputField} from "../../../components/input/numberInputField";

const comparisons = [
    {value: Comparison.EQ, label: '=='},
    {value: Comparison.GT, label: '>'},
    {value: Comparison.GE, label: '>='},
    {value: Comparison.LT, label: '<'},
    {value: Comparison.LE, label: '<='},
];





export function ComparisonControlContainer(
    props : { data: NodeControl<ChooseNodeComparisonData>}
) {
    return (
        <InputGroup>
            <NumberInputField
                inputHint={"left"}
                value={props.data.get('lh')}
                disabled={true}
            />
            <FloatingLabel
                label={"comp"}
                onPointerDown={(e)=>{e.stopPropagation()}}
                onDoubleClick={e=>{e.stopPropagation()}}
            >
                <FormSelect
                    className={"field"}
                    aria-label="Default select example"
                    value={props.data.get('comparison')}
                    onChange={(e)=> {
                        props.data.set({comparison: e.target.value as Comparison});
                    }}
                >
                    {comparisons.map((val, idx) => {
                        return <option key={idx} value={val.value}>{val.label}</option>
                    })
                    }
                </FormSelect>
            </FloatingLabel>
            <NumberInputField
                inputHint={"right"}
                value={props.data.get('rh')}
                onChange={(value)=>{
                    props.data.set({rh: value});
                }}/>
        </InputGroup>
    )
}



export function ChooseNodeContainer(
    props : { data: NodeControl<ChooseNodeControlData>}
) {
    return (
        <Provider store={store}>
            <ChooseNodeContent data={props.data} />
        </Provider>
    )
}

function ChooseNodeContent(
    props : { data: NodeControl<ChooseNodeControlData> }
) {
    return (
        <Drag.NoDrag>
            <Button
                onClick = {() => {
                    props.data.set({comparisonCount: props.data.get('comparisonCount') + 1});
                }}
            >Add input</Button>
            <Button
                onClick = {() => {
                    props.data.set({comparisonCount: props.data.get('comparisonCount') - 1});
                }}
            >
            Remove input
            </Button>
        </Drag.NoDrag>
    )
}