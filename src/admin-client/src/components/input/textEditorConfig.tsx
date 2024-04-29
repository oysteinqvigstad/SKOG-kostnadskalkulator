import StarterKit from '@tiptap/starter-kit'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import {Button, ButtonGroup} from "react-bootstrap";
import {Editor, Extensions} from "@tiptap/react";
import React from "react";
import {MdSubscript, MdSuperscript} from "react-icons/md";

export interface textEditorConfig {
    extensions: Extensions,
    allowedTags: string[],
    menuBar: React.FC<{ editor: Editor | null }>
}

export var simpleConfig: textEditorConfig = {
    extensions: [
        StarterKit,
        Superscript,
        Subscript,
    ],
    allowedTags: [
        'p',
        'strong', 'i',
        'sup', 'sub'
    ],
    menuBar: complexMenuBar
}

function complexMenuBar(props: { editor: Editor | null }) {
    const editor = props.editor;
    if (!editor) {
        return (
            <>
            </>
        )
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
                    <MdSuperscript/>
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
                    <MdSubscript/>
                </Button>
            </ButtonGroup>
        </>
    )
}