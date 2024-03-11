import {NumberControlData} from "./numberControlData";
import {NumberInputField} from "../../../components/input/numberInputField";
import {NodeControl} from "../../nodes/baseNode";

export function NumberControlComponent(
    props: {data: NodeControl<NumberControlData> }
) {
    return <>
        <NumberInputField
            inputHint={"value"}
            value={props.data.data.value}
            onChange={(n)=>{
                if(!props.data.data.readonly) {
                    props.data.data.value = n;
                    props.data.options.onUpdate(props.data.data);
                }
            }}
            onIllegalValue={()=>{}}
            legalRanges={[]}
        />
    </>
}