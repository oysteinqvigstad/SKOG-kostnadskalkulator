import {TextInputField} from "../../../components/input/textInputField";
import {OutputNodeControlData} from "./outputNodeControlData";
import {NodeControl} from "../../nodes/baseNode";
import {CompactPicker} from "react-color";
import {useState} from "react";
import {Dropdown} from "react-bootstrap";

import {Drag} from "rete-react-plugin";

export function OutputNodeControlContainer(
    props: { data: NodeControl<OutputNodeControlData> }
) {
    const [show, setShow] = useState(false);
    return <>
        <Drag.NoDrag>
            <TextInputField
                value={props.data.data.name}
                onChange={
                    (newName)=>{
                        props.data.data.name = newName;
                        props.data.options.onUpdate?.(props.data.data);
                    }}
                inputHint={"Output Name"}
            />
            <ColorPicker
                onChange={(color)=>{
                    props.data.data.color = color;
                    props.data.options.onUpdate?.(props.data.data);
                    setShow(false);
                }}
                show={show}
                color={props.data.data.color || "#FFFFFF"}
            />
        </Drag.NoDrag>
    </>
}


export function ColorPicker(
    props: { show: boolean, color: string, onChange: (color: string)=>void }
) {
    return <Dropdown id={"color-picker"}>
        <Dropdown.Toggle style={{backgroundColor: props.color }} variant={"success"} id={"dropdown-basic"}>Color</Dropdown.Toggle>
        <Dropdown.Menu>
            <CompactPicker
                color={props.color}
                onChangeComplete={(color)=>{
                    props.onChange(color.hex);}
            }/>
        </Dropdown.Menu>
    </Dropdown>
}
