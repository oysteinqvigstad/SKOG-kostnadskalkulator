import StarterKit from '@tiptap/starter-kit'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import {Editor, Extensions} from "@tiptap/react";
import React from "react";
import {Gapcursor} from "@tiptap/extension-gapcursor";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import {SimpleMenuBar, StandardMenuBar} from "./TextEditorMenuBar";

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
    menuBar: SimpleMenuBar
}

export var standardConfig: textEditorConfig = {
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
        Gapcursor,
        Table.configure({
            resizable: true,
            HTMLAttributes: {
                class: "table"
            }
        }),
        TableRow,
        TableHeader,
        TableCell,
    ],
    allowedTags: [
        'p', 'a',
        'h1', 'h2', 'h3', 'h4',
        'strong', 'i',
        'figure', 'table', 'tbody', 'td', 'tr',
        'blockquote',
        'li', 'ul', 'ol',
        'sup', 'sub'
    ],
    menuBar: StandardMenuBar
}

