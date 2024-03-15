import {ReteFunctions} from "../../rete/editor";
import {Button, Modal} from "react-bootstrap";

export function NavBarSaveDialogue(props: {
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
                {"Save Calculator"}
            </Modal.Header>
            <Modal.Body>
                <Button
                    onClick={() => props.functions?.save()}

                >{"Save to browser local store"}</Button>
            </Modal.Body>
        </Modal>
    )
}