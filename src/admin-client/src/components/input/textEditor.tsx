import React, {useState} from "react";
import {Button, Card, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "react-bootstrap";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {MdEdit} from "react-icons/md";
import sanitizeHtml from 'sanitize-html';
import parse from 'html-react-parser';


export function TextEditor(props: { value: string, onSave: (value: string) => void }): JSX.Element {
    const [show, setShow] = useState(false);
    const [value, setValue] = useState(props.value);

    const editorConfiguration = {
        //removePlugins: ['Image']
        toolbar: {
            removeItems: ['uploadImage', 'mediaEmbed']
        }
    }

    const allowedTags = [
        'p', 'a',
        'h2', 'h3', 'h4',
        'strong', 'i',
        'figure', 'table', 'tbody', 'td', 'tr',
        'blockquote',
        'li', 'ul', 'ol']

    const handleShow = () => setShow(!show);
    const handleSave = () => {
        const cleanHTML = sanitizeHtml(value, {
            allowedTags: allowedTags
        })
        props.onSave(cleanHTML);
        handleShow();
    }

    return <>
        <Row>
            <Card className={"w-75"}>
                <Card.Body>
                    <Card.Title className={"d-flex flex-row justify-content-between"}>
                        Info text
                        <Button
                            onClick={handleShow}>
                            <MdEdit/>
                        </Button>
                    </Card.Title>
                    {parse(value)}
                </Card.Body>
            </Card>
            <Modal show={show} onHide={handleShow}>
                <ModalHeader closeButton>
                    <Modal.Title>Edit info text</Modal.Title>
                </ModalHeader>
                <ModalBody>
                    <CKEditor
                        editor={ClassicEditor}
                        config={editorConfiguration}
                        data={value}
                        /*onReady={ ( editor ) => {
                            console.log( "CKEditor5 React Component is ready to use!", editor );
                        } }*/
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setValue(data);
                        }}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant={"primary"}
                        onClick={handleSave}>
                        Save info text
                    </Button>
                </ModalFooter>
            </Modal>
        </Row>
    </>
}