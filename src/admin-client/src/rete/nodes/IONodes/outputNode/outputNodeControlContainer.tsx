import {TextInputField} from "../../../../components/input/textInputField";
import {OutputNodeControlData} from "./outputNodeControlData";
import {NodeControl} from "../../baseNode";
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
                value={props.data.get('name')}
                onChange={
                    (newName)=>{
                        props.data.set({name: newName})
                    }}
                inputHint={"Output Name"}
            />
            <ColorPicker
                onChange={(color)=>{
                    props.data.set({color: color});
                    setShow(false);
                }}
                show={show}
                color={props.data.get('color') || "#FFFFFF"}
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
