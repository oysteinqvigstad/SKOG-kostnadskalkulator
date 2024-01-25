import {FieldData, FieldType} from "../constants/FieldData";
import {InputNumber} from "../components/InputNumber";
import {InputDropdown} from "../components/InputDropdown";
import {Button, InputGroup} from "react-bootstrap";
import {InfoCircle} from "react-bootstrap-icons";

export function InputField({fieldData}: {fieldData: FieldData}) {

    // creates a mapping of field type with corresponding jsx component
    const fieldComponents = {
        [FieldType.NUMBERED_INPUT]: InputNumber,
        [FieldType.DROPDOWN_INPUT]: InputDropdown,
    }
    const Component = fieldComponents[fieldData.type]


   return (
       <InputGroup className="mb-3">
           <Button>
               <InfoCircle />
           </Button>
           {Component ? <Component fieldData={fieldData} /> : null}
       </InputGroup>
   )
}