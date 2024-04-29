import {Editor} from "@tiptap/react";
import {Button, ButtonGroup, Dropdown, DropdownButton} from "react-bootstrap";
import React from "react";
import {MdSubscript, MdSuperscript} from "react-icons/md";

export function StandardMenuBar(props: { editor: Editor | null }) {
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
                    Strikethrough
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
            <ButtonGroup>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('paragraph')}
                    onClick={() => editor.chain().focus().setParagraph().run()}>
                    Paragraph
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <DropdownButton variant={"outline-dark"} id={"Headings dropdown"} title={"Headings"}>
                    <Dropdown.Item
                        active={editor.isActive('heading', {level: 1})}
                        onClick={() => editor.chain().focus().toggleHeading({level: 1}).run()}>
                        h1
                    </Dropdown.Item>
                    <Dropdown.Item
                        active={editor.isActive('heading', {level: 2})}
                        onClick={() => editor.chain().focus().toggleHeading({level: 2}).run()}>
                        h2
                    </Dropdown.Item>
                    <Dropdown.Item
                        active={editor.isActive('heading', {level: 3})}
                        onClick={() => editor.chain().focus().toggleHeading({level: 3}).run()}>
                        h3
                    </Dropdown.Item>
                    <Dropdown.Item
                            active={editor.isActive('heading', {level: 4})}
                            onClick={() => editor.chain().focus().toggleHeading({level: 4}).run()}>
                            h4
                    </Dropdown.Item>
                </DropdownButton>
            </ButtonGroup>
            <ButtonGroup>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    Bullet list
                </Button>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    Ordered list
                </Button>
            </ButtonGroup>
            <ButtonGroup>
                <Button
                    variant={"outline-dark"}
                    active={editor.isActive('table')}
                    onClick={() => editor.chain().focus().insertTable({rows: 3, cols: 3, withHeaderRow: true}).run()
                    }
                >
                    Insert Table
                </Button>
            </ButtonGroup>
        </>
    )
}

export function SimpleMenuBar(props: { editor: Editor | null }) {
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