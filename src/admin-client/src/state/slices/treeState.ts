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
        updateTree: (state, action: PayloadAction<ParseNode[]>) => {
            state.tree = treeStateFromData(action.payload) ?? state.tree;
        }
    }
})

export const {updateTree} = treeStateSlice.actions;
export const treeStateReducer = treeStateSlice.reducer;

