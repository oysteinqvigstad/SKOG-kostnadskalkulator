import {FieldData, FieldType} from "../types/FieldData";
import {InputNumber} from "../components/InputNumber";
import {InputDropdown} from "../components/InputDropdown";
import {Button, InputGroup, Modal} from "react-bootstrap";
import {InfoCircle} from "react-bootstrap-icons";
import {useState} from "react";

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
                   <InfoCircle />
               </Button>
               {Component ? <Component fieldData={props.fieldData} /> : null}
           </InputGroup>
           <Modal show={show} onHide={handleClose}>
               <Modal.Header closeButton>
                   <Modal.Title>{props.fieldData.title}</Modal.Title>
               </Modal.Header>
               <Modal.Body>Her kommer beskrivelse av parameter</Modal.Body>
           </Modal>
       </>
   )
}