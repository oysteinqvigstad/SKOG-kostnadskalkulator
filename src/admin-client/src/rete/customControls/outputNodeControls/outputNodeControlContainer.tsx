import {TextInputField} from "../../../components/input/textInputField";
import {OutputNodeControlData} from "./outputNodeControlData";
import {NodeControl} from "../../nodes/baseNode";


export function OutputNodeControlContainer(
    props: { data: NodeControl<OutputNodeControlData> }
) {
    return <>
        <TextInputField value={props.data.data.name} onChange={
            (newName)=>{
                props.data.data.name = newName;
                props.data.options.onUpdate?.(props.data.data);
            }
        }/>
    </>
}