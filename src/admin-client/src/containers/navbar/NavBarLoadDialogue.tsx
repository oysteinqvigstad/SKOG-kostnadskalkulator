import {ReteFunctions} from "../../rete/editor";
import {Modal} from "react-bootstrap";

export function NavBarLoadDialogue(props: {
    show: boolean,
    onHide: () => void,
    functions: ReteFunctions | null
}) {
    return (
       <Modal
           show={props.show}
           onHide={props.onHide}
       >
           <Modal.Header closeButton>
               {"Load Calculator"}
           </Modal.Header>
           <Modal.Body>
                <LoadDialogueTableFromAPI />
           </Modal.Body>
       </Modal>
    )
}

function LoadDialogueTableFromAPI() {

    return (
        <></>
    )
}