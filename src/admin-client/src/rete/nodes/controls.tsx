import {ClassicPreset} from "rete";
import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import {Form, InputGroup, Row} from "react-bootstrap";




export class ButtonControl extends ClassicPreset.Control {
    constructor(public label: string, public onClick: () => void) {
        super();
    }
}


export function DropdownValues() {

    const [state, setState] = useState({
        formValues: [""],
        enumerate: false,
        enumerations: [1]
    });

    return <>
            <Button
                onDoubleClick={(e) => {e.stopPropagation()}}
                onPointerDown={(e) => {e.stopPropagation()}}
                onClick={()=>{
                    state.formValues.push("");
                    state.enumerations.push(state.enumerations.length+1)
                    setState({
                        formValues: state.formValues,
                        enumerate: state.enumerate,
                        enumerations: state.enumerations
                    });
                    state.formValues.forEach((value) => {console.log(value)});
                }}
            >
                + Add value
            </Button>
            <Button
                onDoubleClick={(e) => {e.stopPropagation()}}
                onPointerDown={(e) => {e.stopPropagation()}}
                onClick={()=>{
                    if(!state.enumerate) {
                        state.enumerations = [];
                        for(let i = 1; i <= state.formValues.length; i++) {
                            state.enumerations.push(i);
                        }
                    }
                    setState({
                        formValues: state.formValues,
                        enumerate: !state.enumerate,
                        enumerations: state.enumerations

                    });
                    state.formValues.forEach((value) => {console.log(value)});
                }}
            >
                Enumerate
            </Button>
            <div>
                {state.formValues.map((value, index) => {
                    return <Row>
                        <InputGroup size="sm" className="mb-3">
                            <Form.Floating
                                onPointerDown={(e)=>{e.stopPropagation()}}
                                onDoubleClick={e=>{e.stopPropagation()}}
                            >
                                <Form.Label></Form.Label>
                                <Form.Control
                                    value={value} type="text" placeholder="Enter label"
                                    onChange={e=> {
                                        state.formValues[index] = e.target.value;
                                        setState({
                                            formValues: state.formValues,
                                            enumerate: state.enumerate,
                                            enumerations: state.enumerations
                                        });
                                    }}
                                />
                            </Form.Floating>
                            {!state.enumerate?
                                <></>
                                :
                                <Form.Floating
                                    onPointerDown={(e)=>{e.stopPropagation()}}
                                    onDoubleClick={e=>{e.stopPropagation()}}
                                >
                                    <Form.Label></Form.Label>
                                    <Form.Control
                                        value={state.enumerations[index]} type="number" placeholder="Enter number"
                                        onChange={e=> {
                                            state.enumerations[index] = parseFloat(e.target.value) ?? 0;
                                            setState({
                                                formValues: state.formValues,
                                                enumerate: state.enumerate,
                                                enumerations: state.enumerations

                                            });
                                        }}
                                    />
                                </Form.Floating>}
                            <Button
                                onClick={()=>{
                                    state.formValues.splice(index, 1);
                                    state.enumerations.splice(index, 1);
                                    setState({
                                        formValues: state.formValues,
                                        enumerate: state.enumerate,
                                        enumerations: state.enumerations
                                    });}
                                }
                                onPointerDown={(e)=>{e.stopPropagation()}}
                                onDoubleClick={e=>{e.stopPropagation()}}
                            > X </Button>
                        </InputGroup>
                    </Row>
                })}
            </div>
        </>
}