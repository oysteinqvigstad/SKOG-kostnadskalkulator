import {InputNumberPreview} from "./InputNumber";
import {Button, InputGroup, Modal} from "react-bootstrap";
import React from "react";
import {useState} from "react";
import {MdInfoOutline} from "react-icons/md";
import {InputDropdownPreview} from "./InputDropdown";
import {DropdownInput, InputNode, NodeType} from "../../parseTree";
import {NumberInputNode} from "../../parseTree/nodes/inputNode";

/**
 * `InputField` is a container for an individual input field. It contains a button that opens a modal with a description
 * of the field, and the input field itself and its corresponding unit
 * @param props - fieldData: FieldData - the data for the field,
 *                hidden: boolean - whether the field should be hidden (stilll applicable for form validation)
 */
export function InputFieldPreview({node}: {node: InputNode}) {
    // modal state
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


   return (
       <>
           <InputGroup className="mb-3">
               <Button variant={"white"} onClick={handleShow} className={"btn-toggle"}>
                   <MdInfoOutline />
               </Button>
               {(node.type === NodeType.NumberInput) ? (
                   <InputNumberPreview node={node as NumberInputNode} />
               ):(
                   <InputDropdownPreview node={node as DropdownInput} />
               )}
               {/*{Component ? <Component node={props.node} /> : null}*/}
           </InputGroup>
           <Modal show={show} onHide={handleClose}>
               <Modal.Header closeButton>
                   <Modal.Title>{node.name}</Modal.Title>
               </Modal.Header>
               <Modal.Body dangerouslySetInnerHTML={{__html: node.infoText}}></Modal.Body>
           </Modal>
       </>
   )
}