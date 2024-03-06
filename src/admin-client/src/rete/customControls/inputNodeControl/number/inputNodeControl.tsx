import {InputNode, NodeType} from "@skogkalk/common/dist/src/parseTree";
import React, {useEffect, useState} from "react";
import {Col, FloatingLabel, Form, InputGroup, Row} from "react-bootstrap";
import {Drag} from "rete-react-plugin";
import {ClassicPreset} from "rete";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import {DropdownInputNode} from "../../../nodes/dropdownInputNode";
import {NumberInputField} from "../../commonComponents/numberInputField";
import {TextInputField} from "../../commonComponents/textInputField";
import {OptionSwitch} from "../../commonComponents/optionSwitch";

export interface InputBaseData {
    name?: string,
    defaultValue?: number,
    simpleInput: boolean,
    pageName?: string,
    infoText?: string,
}


export abstract class InputBasicControl extends ClassicPreset.Control {
    /**
     * @param name
     * @param defaultValue
     * @param simpleInput
     * @param pageName
     * @param infoText
     * @param options
     */
    protected constructor(
        public simpleInput: boolean,
        public options: {
            onUpdate?: (input: InputBasicControl) => void,
            minimized: boolean,
        },
        public name?: string,
        public defaultValue?: number,
        public pageName?: string,
        public infoText?: string,
    ) {
        super();
    }

    public update() : void {
        this.options?.onUpdate?.(this);
    }
}

export class NumberInputBaseControls extends InputBasicControl {
    /**
     *
     * @param baseData
     * @param legalValues
     * @param options
     */
    constructor(
        baseData: InputBaseData,
        public legalValues: { min?: number, max?: number }[],
        options: {
            onUpdate?: (input: InputBasicControl) => void,
            minimized: boolean,
        }
    ) {
        super(
            baseData.simpleInput,
            options,
            baseData.name,
            baseData.defaultValue,
            baseData.pageName,
            baseData.infoText,
        );
    }
}

export class DropdownInputBaseControls extends InputBasicControl{

    constructor(
        baseData: InputBaseData,
        public dropdownOptions: { value: number, label: string }[],
        options: {
            minimized: boolean,
            onUpdate?: (input: InputBasicControl) => void,
        },
        public defaultKey?: string
    ) {
        super(
            baseData.simpleInput,
            options,
            baseData.name,
            baseData.defaultValue,
            baseData.pageName,
            baseData.infoText,
        );
    }
}













export function MinimizeButton(
    props: { onClick: ()=>void }
) {
    return <Button  onClick={props.onClick}>
        Minimize
    </Button>
}

export function HiddenOnMinimized(
    props: { minimized: boolean, content: React.ReactNode }
) {
    return props.minimized ? null : <>{props.content}</>;
}


export function NumberInputControls(
    props: { data: NumberInputBaseControls }
) {
    return <>
        <Drag.NoDrag>
            <MinimizeButton  onClick={()=>{
                props.data.options.minimized = !props.data.options.minimized;
                props.data.update()
            }}/>
            <TextInputField value={props.data.name} inputHint={'Input Name'} onChange={
                (value)=>{
                    props.data.name = value;
                    props.data.update();
                }
            }/>
            <HiddenOnMinimized
                minimized={props.data.options.minimized}
                content={
                    <div>
                    <Row>
                        <Col>
                            <NumberInputField
                                inputHint={"Default value"}
                                value={props.data.defaultValue}
                                onChange={(value)=> {
                                    props.data.defaultValue = value;
                                    props.data.update();
                                }}
                                onIllegalValue={(value)=>{console.log("Illegal value: ", value)}}
                                legalRanges={props.data.legalValues}
                            />
                        </Col>
                        <Col>
                            <OptionSwitch on={props.data.simpleInput} onChange={
                                (on: boolean)=> {
                                    props.data.simpleInput = on;
                                    props.data.update();
                                }
                            }/>
                        </Col>
                    </Row>
                    <Button
                        onDoubleClick={(e) => {e.stopPropagation()}}
                        onPointerDown={(e) => {e.stopPropagation()}}
                        onClick={()=>{
                            props.data.legalValues.push({ min: 0, max: 0 });
                            props.data.update();
                        }}
                    >
                        Add legal range
                    </Button>
                    {props.data.legalValues.map((value, index) => {
                        return <InputGroup className="mb-3">
                                <NumberInputField
                                    inputHint={"min"}
                                    value={props.data.legalValues[index].min}
                                    onChange={ (value)=> {
                                        props.data.legalValues[index].min = value;
                                        props.data.update();
                                    }}
                                    onIllegalValue={(value)=>{console.log("Illegal value: ", value)}}
                                    legalRanges={[{max: props.data.legalValues[index].max}]}
                                />
                                <NumberInputField
                                    inputHint={"max"}
                                    value={props.data.legalValues[index].max}
                                    onChange={ (value)=> {
                                        props.data.legalValues[index].max = value;
                                        props.data.update();
                                    }}
                                    onIllegalValue={(value)=>{console.log("Illegal value: ", value)}}
                                    legalRanges={[{min: props.data.legalValues[index].min}]}
                                />
                                <Button
                                    onClick={()=>{
                                        props.data.legalValues.splice(index, 1);
                                        props.data.update();
                                    }}
                                    onPointerDown={(e)=>{e.stopPropagation()}}
                                    onDoubleClick={e=>{e.stopPropagation()}}
                                > X </Button>
                            </InputGroup>


                       })
                    }
                    </div>
                }
            />
        </Drag.NoDrag>
    </>
}

