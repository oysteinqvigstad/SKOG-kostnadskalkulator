import {Provider} from "react-redux";
import {selectPages, store} from "../../../../state/store";
import {useAppDispatch, useAppSelector} from "../../../../state/hooks";
import React, {useEffect} from "react";
import {Drag} from "rete-react-plugin";
import {TextInputField} from "../../../../components/input/textInputField";
import {Col, InputGroup, Row} from "react-bootstrap";
import {NumberInputField} from "../../../../components/input/numberInputField";
import {OptionSwitch} from "../../../../components/input/optionSwitch";
import Button from "react-bootstrap/Button";
import {DropdownSelection} from "../../../../components/input/dropdownSelection";
import {HiddenOnMinimized, MinimizeButton} from "../sharedComponents";
import {NodeControl} from "../../parseableBaseNode";
import {NumberInputData} from "./numberInputControlData";
import {addInputToPage} from "../../../../state/slices/pages";


export function NumberInputControlContainer(
    props: { data: NodeControl<NumberInputData> }
) {
    return <Provider store={store}>
        <NumberInputControlsContent data={props.data}/>
    </Provider>
}


export function NumberInputControlsContent(
    props: { data: NodeControl<NumberInputData> }
) {

    const pages = useAppSelector(selectPages);
    const dispatch = useAppDispatch();

    useEffect(()=> {
        // finds new index of page if it has been moved
        if(props.data.get('pageName') !== undefined) {
            const pageName = props.data.get('pageName');
            const result = pages.find(({id, page})=>{
                return page.title === pageName;
            });

            if(result) {
                props.data.set({pageName: result.page.title});
            }
        }
    }, [pages, props.data])


    return <>
        <Drag.NoDrag>
            <MinimizeButton  onClick={()=>{
                props.data.options.minimized = !props.data.options.minimized;
                props.data.update()
            }}/>
            <TextInputField value={props.data.get('name')} inputHint={'Input Name'} onChange={
                (value)=>{
                    props.data.set({name: value});
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
                                    value={props.data.get('defaultValue')}
                                    onChange={(value)=> {
                                        props.data.set({defaultValue: value});
                                    }}
                                    onIllegalValue={(value)=>{console.log("Illegal value: ", value)}}
                                    legalRanges={props.data.get('legalValues')}
                                />
                            </Col>
                            <Col>
                                <OptionSwitch on={props.data.get('simpleInput')} onChange={
                                    (on: boolean)=> {
                                        props.data.set({simpleInput: on});
                                    }
                                }/>
                            </Col>
                        </Row>
                        <Button
                            onDoubleClick={(e) => {e.stopPropagation()}}
                            onPointerDown={(e) => {e.stopPropagation()}}
                            onClick={()=>{
                                const legalValues = [...props.data.get('legalValues')];
                                legalValues.push({min: 0, max: 0});
                                props.data.set({legalValues: legalValues});
                            }}
                        >
                            Add legal range
                        </Button>
                        {props.data.get('legalValues').map((value, index) => {
                            return <InputGroup className="mb-3">
                                <NumberInputField
                                    inputHint={"min"}
                                    value={props.data.get('legalValues')[index].min}
                                    onChange={ (value)=> {
                                        props.data.get('legalValues')[index].min = value;
                                        props.data.update();
                                    }}
                                    onIllegalValue={(value)=>{console.log("Illegal value: ", value)}}
                                    legalRanges={[{max: props.data.get('legalValues')[index].max}]}
                                />
                                <NumberInputField
                                    inputHint={"max"}
                                    value={props.data.get('legalValues')[index].max}
                                    onChange={ (value)=> {
                                        props.data.get('legalValues')[index].max = value;
                                        props.data.update();
                                    }}
                                    onIllegalValue={(value)=>{console.log("Illegal value: ", value)}}
                                    legalRanges={[{min: props.data.get('legalValues')[index].min}]}
                                />
                                <Button
                                    onClick={()=>{
                                        props.data.set({legalValues: [...props.data.get('legalValues')].splice(index, 1)});
                                    }}
                                    onPointerDown={(e)=>{e.stopPropagation()}}
                                    onDoubleClick={e=>{e.stopPropagation()}}
                                > X </Button>
                            </InputGroup>


                        })
                        }
                        <DropdownSelection
                            inputHint={"Select page"}
                            selection={pages.findIndex(({page})=>page.title === props.data.get('pageName'))}
                            dropdownAlternatives={pages.map(({ page })=>{return {label: page.title, value: page.ordering}})}
                            onChange={(selected: number)=>{
                                console.log("pageName", props.data.get('pageName'))
                                const pageName = pages.find(({ page })=>page.ordering === selected)?.page.title;
                                console.log("Selected page: ", pageName);
                                props.data.set({pageName: pageName});
                                if(pageName) {
                                    dispatch(addInputToPage({nodeID: props.data.get('id'), pageName: pageName}))
                                }
                            }}
                        />
                    </div>
                }
            />
        </Drag.NoDrag>
    </>
}

