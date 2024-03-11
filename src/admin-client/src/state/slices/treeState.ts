import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    TreeState
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
        updateTree: (state, action: PayloadAction<TreeState>) => {
            state.tree = action.payload;
        }
    }
})

export const {updateTree} = treeStateSlice.actions;
export const treeStateReducer = treeStateSlice.reducer;

