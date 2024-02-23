import {ClassicPreset} from "rete";
import React, {useState} from "react";
import Button from "react-bootstrap/Button";
import {Form, InputGroup, Row} from "react-bootstrap";
import {InputAlternative} from "@skogkalk/common/dist/src/parseTree/nodeMeta/input";


export class DropdownValuesControl extends ClassicPreset.Control {

    constructor(
        public label: string,
        public initialState: InputAlternative[],
        public onElementUpdate: (dropdownAlternatives: InputAlternative[])=> void
    ) {
        super();
    }
}


export function DropdownValues(
    props :{
        onUpdate: (dropdownAlternatives: InputAlternative[])=> void,
        initialState?: InputAlternative[]
    }
) {

    const [state, setState] = useState({
        dropDownAlternatives: props.initialState ?? [{name:"", value: 0}],
        enumerate: true,
    });

    return <>
            <Button
                onDoubleClick={(e) => {e.stopPropagation()}}
                onPointerDown={(e) => {e.stopPropagation()}}
                onClick={()=>{
                    state.dropDownAlternatives.push({name:"", value: state.dropDownAlternatives.length + 1});
                    setState({
                        dropDownAlternatives : state.dropDownAlternatives,
                        enumerate: state.enumerate
                    });
                    props.onUpdate(state.dropDownAlternatives);
                }}
            >
                + Add value
            </Button>
            {/*<Button*/}
            {/*    onDoubleClick={(e) => {e.stopPropagation()}}*/}
            {/*    onPointerDown={(e) => {e.stopPropagation()}}*/}
            {/*    onClick={()=>{*/}
            {/*        if(!state.enumerate) {*/}
            {/*            state.enumerations = [];*/}
            {/*            for(let i = 1; i <= state.formValues.length; i++) {*/}
            {/*                state.enumerations.push(i);*/}
            {/*            }*/}
            {/*        }*/}
            {/*        setState({*/}
            {/*            formValues: state.formValues,*/}
            {/*            enumerate: !state.enumerate,*/}
            {/*            enumerations: state.enumerations*/}

            {/*        });*/}
            {/*    }}*/}
            {/*>*/}
            {/*    Enumerate*/}
            {/*</Button>*/}
            <div>
                {state.dropDownAlternatives.map(({name, value}, index) => {
                    return <Row>
                        <InputGroup size="sm" className="mb-3">
                            <Form.Floating
                                onPointerDown={(e)=>{e.stopPropagation()}}
                                onDoubleClick={e=>{e.stopPropagation()}}
                            >
                                <Form.Label></Form.Label>
                                <Form.Control
                                    value={name} type="text" placeholder="Enter label"
                                    onChange={e=> {
                                        state.dropDownAlternatives[index].name = e.target.value;
                                        setState({
                                            dropDownAlternatives: state.dropDownAlternatives,
                                            enumerate: state.enumerate
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
                                        value={state.dropDownAlternatives[index].value} type="number" placeholder="Enter number"
                                        onChange={e=> {
                                            state.dropDownAlternatives[index].value = parseFloat(e.target.value) ?? 0;
                                            setState({
                                                dropDownAlternatives: state.dropDownAlternatives,
                                                enumerate: state.enumerate
                                            });
                                        }}
                                    />
                                </Form.Floating>}
                            <Button
                                onClick={()=>{
                                    state.dropDownAlternatives.splice(index, 1);
                                    setState({
                                        dropDownAlternatives: state.dropDownAlternatives,
                                        enumerate: state.enumerate
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