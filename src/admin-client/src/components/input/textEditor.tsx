import React, {useState} from "react";
import {
    Button,
    ButtonGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "react-bootstrap";
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
            <ButtonGroup>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleBold()
                            .run()}>
                    Bold
                </Button>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleItalic()
                            .run()}>
                    Italic
                </Button>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('strike')}
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
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('superscript')}
                    onClick={() => editor.chain().focus().toggleSuperscript().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleSuperscript()
                            .run()
                    }>
                    Superscript
                </Button>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('subscript')}
                    onClick={() => editor.chain().focus().toggleSubscript().run()}
                    disabled={
                        !editor.can()
                            .chain()
                            .focus()
                            .toggleSubscript()
                            .run()}>
                    Subscript
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                    <Button
                    variant={"outline-dark"}
                    active={editor.isActive('paragraph')}
                    onClick={() => editor.chain().focus().setParagraph().run()}>
                    paragraph
                </Button>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('heading', {level: 1})}
                    onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}>
                    h1
                </Button>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('heading', {level: 2})}
                    onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}>
                    h2
                </Button>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('heading', {level: 3})}
                    onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}>
                    h3
                </Button>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('heading', {level: 4})}
                    onClick={() => editor.chain().focus().toggleHeading({level: 4}).run()}>
                    h4
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    bullet list
                </Button>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    ordered list
                </Button>
            </ButtonGroup>
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
        'h1', 'h2', 'h3', 'h4',
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