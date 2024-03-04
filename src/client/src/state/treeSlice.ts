import {
    getNodeByID, InputNode,
    resetInputToDefault,
    setInputValue,
    TreeState,
    treeStateFromData
} from "@skogkalk/common/dist/src/parseTree";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface TreeFormState {
    tree: TreeState | undefined
    activePage: string
    inputFieldValues: {
        [id: string]: string
    }
}

const initialTreeFormState: TreeFormState = {
    tree: undefined,
    activePage: "",
    inputFieldValues: {}
}

export const treeFormSlice = createSlice({
    name: 'tree',
    initialState: initialTreeFormState,
    reducers: {
        initiateTree: (state, action: PayloadAction<{data: any}>) => {
            state.tree = treeStateFromData(action.payload.data)
            state.tree.inputs.forEach((inputNode) => {
                if (state.inputFieldValues[inputNode.id] && state.tree) {
                    // update tree if input is defined already
                    state.tree = setInputValue(state.tree, inputNode.id, parseFloat(state.inputFieldValues[inputNode.id]))
                } else {
                    // set default value to input field
                    state.inputFieldValues[inputNode.id] = inputNode.value.toString()
                }
            })
        },
        setField: (state, action: PayloadAction<{id: string, value: string}>) => {
            const {id, value} = action.payload
            state.inputFieldValues[id] = value
            if (state.tree) {
                state.tree = setInputValue(state.tree, id, parseFloat(value))
            }
        },
        setActivePage: (state, action: PayloadAction<{title: string}>) => {
            state.activePage = action.payload.title
        },
        resetField: (state, action: PayloadAction<{id: string}>) => {
            if (state.tree) {
                const node = getNodeByID(state.tree, action.payload.id) as InputNode
                if (node) {
                    state.tree = resetInputToDefault(state.tree, node)
                    state.inputFieldValues[action.payload.id] = node.defaultValue.toFixed()
                }
            }
        }
    }
})

export const {initiateTree, setField, resetField, setActivePage} = treeFormSlice.actions
export default treeFormSlice.reducer