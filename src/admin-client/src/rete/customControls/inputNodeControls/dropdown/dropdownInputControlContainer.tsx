import {Drag} from "rete-react-plugin"
import {HiddenOnMinimized, MinimizeButton} from "../common/sharedComponents";
import {TextInputField} from "../../../../components/input/textInputField";
import {Provider} from "react-redux";
import {store} from "../../../../state/store";
import {Col, Row} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {NumberInputField} from "../../../../components/input/numberInputField";
import {InputGroup} from "react-bootstrap";
import {NodeControl} from "../../../nodes/baseNode";
import {DropdownInputControlData} from "./dropdownInputControlData";
import {DropdownSelection} from "../../../../components/input/dropdownSelection";


export function DropdownInputControlContainer(
    props: { data: NodeControl<DropdownInputControlData> }
) {
    // Wrap in store provider to access Redux state
    return <Provider store={store}>
        <DropdownInputControlContent data={props.data}/>
    </Provider>
}


export function DropdownInputControlContent(
    props: { data: NodeControl<DropdownInputControlData> }
) {
    const data = props.data.data;
    const options = props.data.options;
    return <>
        <Drag.NoDrag>
            <MinimizeButton onClick={() => {
                props.data.options.minimized = !props.data.options.minimized;
                props.data.update();
            }}/>

            <TextInputField
                value={data.name}
                inputHint={'Input Name'}
                onChange={
                    (value: string) => {
                        data.name = value;
                        options.onUpdate(data);
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
                                        data.dropdownOptions.push({
                                            value: 0,
                                            label: `option ${data.dropdownOptions.length + 1}`
                                        })
                                        options.onUpdate(data);
                                    }}
                                >
                                    Add option
                                </Button>
                                {data.dropdownOptions.map((item, index) => {
                                    return <InputGroup key={item.label} className="mb-3">

                                        <TextInputField
                                            value={item.label}
                                            inputHint={"name"}
                                            onChange={(newLabel) => {
                                                data.dropdownOptions[index].label = newLabel
                                                // TODO: Må endre tegn for tegn om denne er med:
                                                //props.data.update();
                                            }}
                                        />
                                        <NumberInputField
                                            inputHint={"value"}
                                            value={data.dropdownOptions[index].value}
                                            onChange={(value) => {
                                                data.dropdownOptions[index].value = value;
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
                                                data.dropdownOptions.splice(index, 1);
                                                props.data.update();
                                            }}
                                            onPointerDown={(e) => {
                                                e.stopPropagation()
                                            }}
                                            onDoubleClick={(e) => {
                                                e.stopPropagation()
                                            }}
                                        >X</Button>
                                        <Button onClick={() => {
                                            if (index >= 0 && index < data.dropdownOptions.length - 1) {
                                                [data.dropdownOptions[index], data.dropdownOptions[index + 1]] = [data.dropdownOptions[index + 1], data.dropdownOptions[index]]
                                            }
                                            props.data.update();
                                        }}>Down</Button>
                                        <Button onClick={() => {
                                            if (index > 0) {
                                                [data.dropdownOptions[index], data.dropdownOptions[index - 1]] = [data.dropdownOptions[index - 1], data.dropdownOptions[index]]
                                            }
                                            props.data.update();
                                        }}>Up</Button>

                                    </InputGroup>


                                })}

                                <DropdownSelection
                                    inputHint={"Set default selection"}
                                    dropdownAlternatives={data.dropdownOptions}
                                    selection={
                                    data.dropdownOptions.findIndex(item =>
                                        item.label === data.defaultKey
                                    )}
                                    onChange={(index) => {
                                        data.defaultKey = data.dropdownOptions[index].label;
                                        data.defaultValue = data.dropdownOptions[index].value;
                                        props.data.update();
                                        console.log(data.defaultKey)
                                    }}
                                />



                            </Col>
                        </Row>
                    </>
                }
            />
        </Drag.NoDrag>

    </>
}