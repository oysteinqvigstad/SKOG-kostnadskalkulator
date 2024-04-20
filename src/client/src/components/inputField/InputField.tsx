import {InputNumber} from "./InputNumber";
import {Button, InputGroup, Modal} from "react-bootstrap";
import {useState} from "react";
import {MdInfoOutline} from "react-icons/md";
import {DropdownInput, InputNode, NodeType} from "@skogkalk/common/dist/src/parseTree";
import {InputDropdown} from "./InputDropdown";
import {NumberInputNode} from "@skogkalk/common/dist/src/parseTree/nodes/inputNode";

/**
 * `InputField` is a container for an individual input field. It contains a button that opens a modal with a description
 * of the field, and the input field itself and its corresponding unit
 * @param props - fieldData: FieldData - the data for the field,
 *                hidden: boolean - whether the field should be hidden (stilll applicable for form validation)
 */
export function InputField({node}: {node: InputNode}) {
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
                   <InputNumber node={node as NumberInputNode} />
               ):(
                   <InputDropdown node={node as DropdownInput} />
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