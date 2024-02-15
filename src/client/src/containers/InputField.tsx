import {FieldData, FieldType} from "../types/FieldData";
import {InputNumber} from "../components/InputNumber";
import {InputDropdown} from "../components/InputDropdown";
import {Button, InputGroup, Modal} from "react-bootstrap";
import {useState} from "react";
import {MdInfoOutline} from "react-icons/md";

/**
 * `InputField` is a container for an individual input field. It contains a button that opens a modal with a description
 * of the field, and the input field itself and its corresponding unit
 * @param props - fieldData: FieldData - the data for the field,
 *                hidden: boolean - whether the field should be hidden (stilll applicable for form validation)
 */
export function InputField(props: {fieldData: FieldData, hidden: boolean}) {
    // creates a mapping of field type with corresponding jsx component
    const fieldComponents = {
        [FieldType.NUMBERED_INPUT]: InputNumber,
        [FieldType.DROPDOWN_INPUT]: InputDropdown,
    }
    const Component = fieldComponents[props.fieldData.type]

    // modal state
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


   return (
       <>
           <InputGroup className="mb-3" hidden={props.hidden}>
               <Button onClick={handleShow}>
                   <MdInfoOutline />
               </Button>
               {Component ? <Component fieldData={props.fieldData} /> : null}
           </InputGroup>
           <Modal show={show} onHide={handleClose}>
               <Modal.Header closeButton>
                   <Modal.Title>{props.fieldData.title}</Modal.Title>
               </Modal.Header>
               <Modal.Body dangerouslySetInnerHTML={{__html: props.fieldData.descriptionHTML}}></Modal.Body>
           </Modal>
       </>
   )
}