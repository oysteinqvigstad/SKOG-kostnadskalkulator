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
    ordering?: number
    simpleInput: boolean
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
    unit: string
}

export function isNumberInputNode(node: ParseNode): node is NumberInputNode {
    return node.type === NodeType.NumberInput;
}

export function isValidValue(node: InputNode, value: number) : boolean {
    if(isNumberInputNode(node)) {
        if(node.legalValues) {
            let legal = false;
            node.legalValues.forEach((range) => {
                if((range.min? value >= range.min : true) && (range.max? value <= range.max : true)) {
                    legal = true;
                }
            })
            return legal;
        } else {
            return true;
        }
    } else if (isDropdownInputNode(node)) {
        return node.dropdownAlternatives
            .find((alternative)=> {
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

export function isDropdownInputNode(node: ParseNode) : node is DropdownInput {
    return node.type === NodeType.DropdownInput;
}














