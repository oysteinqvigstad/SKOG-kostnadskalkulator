import {
    DropdownInput, getInputByName,
    getNodeByID,
    InputNode,
    NodeType,
    OutputNode,
    setInputValue,
    TreeState
} from "@skogkalk/common/dist/src/parseTree";
import {BadRequestError} from "../types/errorTypes";

export function generateJsonCalculationResponse(tree: TreeState) {
    return tree.displayNodes.reduce<{[key: string]: any}>((acc, displayNode) => {
        acc[displayNode.name] = displayNode.inputOrdering.map(ref => {
            const outputNode = getNodeByID(tree, ref.outputID) as OutputNode
            return {
                name: outputNode.name,
                value: outputNode.value,
                unit: outputNode.unit,
            }
        })
        return acc
    }, {})
}

/**
 * Sets the value of all input nodes in the tree by parsing the JSON object containing the page name and the input values
 * @param tree - The current tree state
 * @param inputs - A JSON object with the page name as key and an object with the input name as key and the input value as value
 * @param verifyAllInputsSet - If true, an error is thrown if an input field is not found
 * @throws Error If the input field is not found,
 *               or if the value cannot be parsed,
 *               or if fields are missing in the JSON object (strict mode)
 */
export function setInputsByJSON(tree: TreeState, inputs: JsonInputs, verifyAllInputsSet: boolean) : TreeState {
    /**
     * Updates the value of a single input field in the tree
     * @throws Error If the the parse tree could not be updated as expected dispite successful parsing
     */
    const updateSingleInput = (tree: TreeState, node: InputNode, value: number | string) : TreeState => {
        let updatedTree: TreeState | undefined = setInputValue(tree, node.id, parseValue(value, node))
        if (!updatedTree) {
            throw new BadRequestError(`something went wrong while updating field ${node.name} on page ${node.pageName} with value ${value}`)
        }
        return updatedTree
    }
    /**
     * Parses the value of an input field from either text or number
     * @throws Error If the value could not be parsed
     */
    const parseValue = (value: string | number, node: InputNode) : number => {
        if (typeof value === "number") {
            return value
        } else if (NodeType.DropdownInput) {
            const convertedValue = (node as DropdownInput)
                .dropdownAlternatives.find((option) => option.label === value)?.value
            if (convertedValue) return convertedValue
        } else if (NodeType.NumberInput) {
            const parsedNumber = parseFloat(value)
            if (!isNaN(parsedNumber)) return parsedNumber
        }
        throw new BadRequestError(`could not parse value ${value} for input ${node.name} on page ${node.pageName}`)

    }
    /**
     * Updates the value of all input fields as specified in the JSON object
     * @throws Error If an input field is not found
     */
    const updateAllValues = (tree: TreeState, inputs: JsonInputs) : TreeState => {
        let updatedTree: TreeState = tree
        for (const [pageName, fields] of Object.entries(inputs)) {
            for (const [fieldName, value] of Object.entries(fields)) {
                const node = getInputByName(tree, fieldName, pageName)
                if (!node) throw new Error(`Field ${fieldName} not found on page ${pageName}`)
                updatedTree = updateSingleInput(updatedTree, node, value)
            }
        }
        return updatedTree
    }
    /**
     * Asserts that all input fields in the Parse Tree are present in the JSON object, this is used in strict mode
     * as an option for developers to ensure that fields are not forgotten
     * @throws Error If a field is missing in the JSON object
     */
    const assertAllFieldsPresent = (inputs: JsonInputs) => {
        const missingFields = tree.inputs.filter((node) => {
            return inputs[node.pageName] === undefined || inputs[node.pageName][node.name] === undefined
        })
        if (missingFields.length > 0) {
            throw new BadRequestError(`missing fields: ${missingFields.map((node) => `${node.name} on page ${node.pageName}`).join(", ")}`)
        }
    }

    if (verifyAllInputsSet) {
        assertAllFieldsPresent(inputs)
    }
    return updateAllValues(tree, inputs)
}
