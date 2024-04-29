import React, {useState} from "react";
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
} from "react-bootstrap";
import {
    EditorContent,
    useEditor,
} from '@tiptap/react'
import {textEditorConfig} from "./textEditorConfig";

export function TextEditor(props: {
    value: string,
    buttonText: string,
    onSave: (value: string) => void,
    config: textEditorConfig
}): JSX.Element {
    const [show, setShow] = useState(false);
    const editor = useEditor({
        extensions: props.config.extensions,
        content: props.value,
    });
    const handleShow = () => setShow(!show);
    const handleSave = () => {
        if (editor !== null) {
            //let cleanHTML = sanitizeHtml(editor.getHTML(), {
            //    allowedTags: props.config.allowedTags
            //});
            let cleanHTML = editor.getHTML();
            if (cleanHTML === "<p></p>") {
                cleanHTML = "";
            }
            props.onSave(cleanHTML);
            handleShow();
        }

    }
    const handleDiscard = () => {
        if (editor !== null) {
            editor.commands.setContent(props.value);
            handleShow();
        }
    }
    return <>
        <Button
            onClick={handleShow}>
            {props.buttonText}
        </Button>
        <Modal
            show={show}
            onHide={handleShow}
            backdrop={"static"}
            centered>
            <ModalBody>
                {props.config.menuBar({editor: editor})}
                <div style={{border: '1px solid #ccc', padding: '10px'}}>
                    <EditorContent editor={editor} /*style={{backgroundColor: "lightgrey"}}*//>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button
                    variant={"danger"}
                    onClick={handleDiscard}>
                    Discard changes
                </Button>
                <Button
                    variant={"primary"}
                    onClick={handleSave}>
                    Save changes
                </Button>
            </ModalFooter>
        </Modal>
    </>
}