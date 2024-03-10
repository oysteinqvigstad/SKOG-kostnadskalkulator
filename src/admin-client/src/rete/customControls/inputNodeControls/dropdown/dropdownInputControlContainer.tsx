import {Drag} from "rete-react-plugin"
import {HiddenOnMinimized, MinimizeButton} from "../common/sharedComponents";
import {TextInputField} from "../../../../components/input/textInputField";
import {DropdownInputControl} from "./dropdownInputControl";
import {Provider} from "react-redux";
import {store} from "../../../../state/store";
import {Col, DropdownButton, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {NumberInputField} from "../../../../components/input/numberInputField";
import {InputGroup} from "react-bootstrap";
import { Dropdown } from "react-bootstrap";


export function DropdownInputControlContainer(
    props: { data: DropdownInputControl }
) {
    // Wrap in store provider to access Redux state
    return <Provider store={store}>
        <DropdownInputContolContent data={props.data}/>
    </Provider>
}


export function DropdownInputContolContent(
    props: { data: DropdownInputControl }
) {


    return <>
        <Drag.NoDrag>
            <MinimizeButton onClick={() => {
                props.data.options.minimized = !props.data.options.minimized;
                props.data.update();
            }}/>

            <TextInputField
                value={props.data.name}
                inputHint={'Input Name'}
                onChange={
                    (value: string) => {
                        props.data.name = value;
                        props.data.update();
                    }
                }/>

            <HiddenOnMinimized
                minimized={props.data.options.minimized}
                content={
                    <>
                        <Row>
                            <Col>

                                <Button
                                    onDoubleClick={(e) => {
                                        e.stopPropagation()
                                    }}
                                    onPointerDown={(e) => {
                                        e.stopPropagation()
                                    }}
                                    onClick={() => {
                                        props.data.dropdownOptions.push({
                                            value: 0,
                                            label: `option ${props.data.dropdownOptions.length + 1}`
                                        })
                                        props.data.update();
                                    }}
                                >
                                    Add option
                                </Button>
                                {props.data.dropdownOptions.map((item, index) => {
                                    return <InputGroup className="mb-3">

                                        <TextInputField
                                            value={item.label}
                                            inputHint={"name"}
                                            onChange={(newLabel) => {
                                                props.data.dropdownOptions[index].label = newLabel
                                                props.data.update();
                                            }
                                            }/>
                                        <NumberInputField
                                            inputHint={"value"}
                                            value={props.data.dropdownOptions[index].value}
                                            onChange={(value) => {
                                                props.data.dropdownOptions[index].value = value;
                                                props.data.update();
                                            }}
                                            onIllegalValue={() => {
                                                return
                                            }}
                                        // TODO: Fjern magisk tall (lagt inn for testing)
                                            legalRanges={[{max: 100}]
                                        }/>
                                        <Button
                                            onClick={() => {
                                                props.data.dropdownOptions.splice(index, 1);
                                                props.data.update();
                                            }}
                                            onPointerDown={(e) => {
                                                e.stopPropagation()
                                            }}
                                            onDoubleClick={(e) => {
                                                e.stopPropagation()
                                            }}
                                        >X</Button>
                                    </InputGroup>


                                })}
                                <DropdownButton title={'Preview'} id={'preview'}>
                                    {props.data.dropdownOptions.map((item) => {
                                        return <Dropdown.Item>{item.label}</Dropdown.Item>
                                        })}
                                </DropdownButton>
                            </Col>
                        </Row>
                    </>
                }
            />
        </Drag.NoDrag>

    </>
}