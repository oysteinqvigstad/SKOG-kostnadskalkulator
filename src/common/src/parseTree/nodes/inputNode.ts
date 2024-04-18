import type {ParseNode} from "./parseNode";
import {NodeType} from "./parseNode";


/**
 * Input node
 */
export interface InputNode extends ParseNode {
    type: NodeType.NumberInput | NodeType.DropdownInput
    name: string
    defaultValue: number
    infoText: string
    pageName: string
    ordering: number
    simpleInput: boolean
    unit: string
}

export function isInputNode(node: ParseNode): node is InputNode {
    return node.type === NodeType.NumberInput || node.type === NodeType.DropdownInput;
}


/**
 * Number input node
 */
export interface NumberInputNode extends InputNode {
    type: NodeType.NumberInput
    inputType: InputType
    legalValues: {
        min: number | null
        max: number | null
    }[]

}

export function isNumberInputNode(node: ParseNode): node is NumberInputNode {
    return node.type === NodeType.NumberInput;
}

export function isValidValue(node: InputNode, value: number): boolean {
    if (isNaN(value)) {
        return false
    }
    if (isNumberInputNode(node)) {
        if (node.inputType === InputType.Integer && value - Math.round(value) !== 0) {
            return false;
        }
        if (node.legalValues.length !== 0) {
            let legal = false;
            node.legalValues.forEach((range) => {
                if (((range.min !== null) ? value >= range.min : true) && ((range.max !== null) ? value <= range.max : true)) {
                    legal = true;
                }
            })
            return legal;
        } else {
            return true;
        }
    } else if (isDropdownInputNode(node)) {
        return node.dropdownAlternatives
            .find((alternative) => {
                return alternative.value === value
            }) !== undefined
    }
    return false;
}


export enum InputType {
    Float,
    Integer
}


/**
 * Dropdown input node
 */
export interface DropdownInput extends InputNode {
    type: NodeType.DropdownInput
    dropdownAlternatives: {
        label: string
        value: number
    }[]
}

export function isDropdownInputNode(node: ParseNode): node is DropdownInput {
    return node.type === NodeType.DropdownInput;
}














