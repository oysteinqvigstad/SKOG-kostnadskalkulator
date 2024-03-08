import {Provider} from "react-redux";
import {selectPages, store} from "../../../../state/store";
import {useAppSelector} from "../../../../state/hooks";
import React, {useEffect} from "react";
import {Drag} from "rete-react-plugin";
import {TextInputField} from "../../../../components/input/textInputField";
import {Col, InputGroup, Row} from "react-bootstrap";
import {NumberInputField} from "../../../../components/input/numberInputField";
import {OptionSwitch} from "../../../../components/input/optionSwitch";
import Button from "react-bootstrap/Button";
import {DropdownSelection} from "../../../../components/input/dropdownSelection";
import {NumberInputControl} from "./numberInputControl";
import {HiddenOnMinimized, MinimizeButton} from "../common/sharedComponents";


export function NumberInputControlContainer(
    props: { data: NumberInputControl }
) {
    return <Provider store={store}>
        <NumberInputControlsContent data={props.data}/>
    </Provider>
}


export function NumberInputControlsContent(
    props: { data: NumberInputControl }
) {

    const pages = useAppSelector(selectPages);

    useEffect(()=> {
        // finds new index of page if it has been moved
        if(props.data.pageName !== undefined) {
            const result = pages.find((p)=>{
                return p.title === props.data.pageName
            });

            props.data.pageName = result?.title ?? undefined;
            props.data.update();
        }
    }, [pages, props.data])


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
                        <DropdownSelection
                            inputHint={"Select page"}
                            selection={pages.find((page)=>page.title === props.data.pageName)?.ordering}
                            dropdownAlternatives={pages.map((page)=>{return {label: page.title, value: page.ordering}})}
                            onChange={(selected: number)=>{
                                props.data.pageName = pages.find((page)=>page.ordering === selected)?.title;
                                console.log("Selected page: ", props.data.pageName)
                                props.data.update();
                            }}
                        />
                    </div>
                }
            />
        </Drag.NoDrag>
    </>
}

