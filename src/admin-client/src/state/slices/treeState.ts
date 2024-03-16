import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ParseNode,
    TreeState, treeStateFromData
} from "@skogkalk/common/dist/src/parseTree";

export interface TreeSliceState {
    tree: TreeState | undefined
}

export const treeStateSlice = createSlice({
    name: "treeState",
    initialState: {
        tree: undefined
    } as TreeSliceState,
    reducers: {
        setTreeState: (state, action: PayloadAction<TreeSliceState>) => {
            return action.payload;
        },
        updateTree: (state, action: PayloadAction<ParseNode[]>) => {
            console.log("updating TreeState")
            state.tree = treeStateFromData(action.payload) ?? state.tree;
        },
    }
})

export const {updateTree, setTreeState} = treeStateSlice.actions;
export const treeStateReducer = treeStateSlice.reducer;

