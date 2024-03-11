import {OutputNodeControl} from "./outputNodeControl";
import {TextInputField} from "../../../components/input/textInputField";


export function OutputNodeControlContainer(
    props: { data: OutputNodeControl }
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