import React, {useState} from "react";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader, ToggleButton, ToggleButtonGroup} from "react-bootstrap";
import {
    EditorContent,
    useEditor,
    Editor,
} from '@tiptap/react'
import Superscript from '@tiptap/extension-superscript'
import StarterKit from '@tiptap/starter-kit'
import sanitizeHtml from 'sanitize-html';
import {Subscript} from "@tiptap/extension-subscript";
import {Placeholder} from "@tiptap/extension-placeholder";

//  TODO: Move this to a separate file and make into interface/class
function MenuBar(props: { editor: Editor | null }) {
    const editor = props.editor;
    if (!editor) {
        return null;
    }
    return (
        <>
            {
                //value doesn't make sense to me, but it's required for the ToggleButtonGroup to work. It's that a
            }
            <ToggleButtonGroup type={"checkbox"} defaultValue={[1]}>
                <ToggleButton
                    id={"bold"}
                    value={2}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()}>
                    Bold
                </ToggleButton>
                <ToggleButton
                    id={"italic"}
                    value={3}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()}>
                    Italic
                </ToggleButton>
                <ToggleButton
                    id={"strikethrough"}
                    value={4}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleStrike()
                            .run()
                    }
                    className={editor.isActive('strike') ? 'is-active' : ''}
                >
                    strikethrough
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup type={"checkbox"} defaultValue={[1]}>
                <ToggleButton
                    id={"superscript"}
                    value={2}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleSuperscript()
                            .run()
                    }>
                    Superscript
                </ToggleButton>
                <ToggleButton
                    id={"subscript"}
                    value={3}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleSubscript()
                            .run()}>
                    Subscript
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup type={"checkbox"} defaultValue={[1]}>
                {   //TODO: consider necessity of paragraph button, as absence of other tags is paragraph by default
                    /*<ToggleButton
                    id={"paragraph"}
                    value={0}
                    checked={editor.isActive('paragraph')}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().setParagraph().run()}>
                    paragraph
                </ToggleButton>*/}
                <ToggleButton
                    id={"heading1"}
                    value={3}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}>
                    h1
                </ToggleButton>
                <ToggleButton
                    id={"heading2"}
                    value={4}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}>
                    h2
                </ToggleButton>
                <ToggleButton
                    id={"heading3"}
                    value={5}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}>
                    h3
                </ToggleButton>
                <ToggleButton
                    id={"heading4"}
                    value={6}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleHeading({level: 4}).run()}>
                    h4
                </ToggleButton>
            </ToggleButtonGroup>
            <ToggleButtonGroup type={"checkbox"} defaultValue={[1]}>
                <ToggleButton
                    id={"bullet-list"}
                    value={2}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    bullet list
                </ToggleButton>
                <ToggleButton
                    id={"ordered-list"}
                    value={3}
                    variant={"outline-dark"}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    ordered list
                </ToggleButton>
            </ToggleButtonGroup>
        </>
    )
}

export function TextEditor(props: { value: string, onSave: (value: string) => void }): JSX.Element {
    const [show, setShow] = useState(false);
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                }
            }),
            Superscript,
            Subscript,
            Placeholder.configure({
                placeholder: 'Start typing here...',
                considerAnyAsEmpty: true,
            })
        ],
        content: props.value,
    });

    const allowedTags = [
        'p', 'a',
        'h2', 'h3', 'h4',
        'strong', 'i',
        'figure', 'table', 'tbody', 'td', 'tr',
        'blockquote',
        'li', 'ul', 'ol',
        'sup', 'sub'
    ];

    const handleShow = () => setShow(!show);
    const handleSave = () => {
        if (editor !== null) {
            const cleanHTML = sanitizeHtml(editor.getHTML(), {
                allowedTags: allowedTags
            });
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
            Edit info text
        </Button>
        {
            //editor !== null ? editor.getHTML() : "No editor"
        }
        {
            //`Initial value: ${props.value}`
        }
        <Modal
            show={show}
            onHide={handleShow}
            backdrop={"static"}
            centered>
            <ModalHeader>
                <Modal.Title>Edit info text</Modal.Title>
            </ModalHeader>
            <ModalBody>
                <MenuBar editor={editor}/>
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