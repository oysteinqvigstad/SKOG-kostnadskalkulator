import {NumberControl, NumberControlData} from "./numberControl";
import {NumberInputField} from "../../../components/input/numberInputField";

export function NumberControlComponent(
    props: {data: NumberControl }
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