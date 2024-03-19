import {NumberControlData} from "./numberControlData";
import {NumberInputField} from "../../../../components/input/numberInputField";

import {NodeControl} from "../../nodeControl";

export function NumberControlComponent(
    props: {data: NodeControl<NumberControlData> }
) {
    return <>
        <NumberInputField
            inputHint={"value"}
            value={props.data.get('value')}
            onChange={(n)=>{
                if(!props.data.get('readonly')) {
                    props.data.set({value: n});
                }
            }}
            onIllegalValue={()=>{}}
            legalRanges={[]}
        />
    </>
}