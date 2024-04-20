import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {DisplayArrangement} from "@skogkalk/common/dist/src/parseTree/nodes/displayNode";
import {DisplayNode, NodeType} from "@skogkalk/common/dist/src/parseTree";

export interface DisplayArrangementsState {
    [id: string]: Arrangements
}
interface Arrangements {
    xs: DisplayArrangement
    md: DisplayArrangement
    lg: DisplayArrangement
}


export const displayArrangementsSlice = createSlice({
    name: 'displayArrangements',
    initialState: {} as DisplayArrangementsState,
    reducers: {
        moveDisplay: (state, action: PayloadAction<{id: string, size: "xs" | "md" | "lg", direction: "forward" | "backward", nodes: DisplayNode[]}>) => {
            let arrangements = extractDisplayArrangements(action.payload.nodes)
            let ids = sortIDsByOrder(action.payload.size, arrangements)
            ids = shiftID(ids, action.payload.id, action.payload.direction)
            arrangements = setArrangeOrderByIndex(arrangements, ids, action.payload.size)
            return arrangements
        },
    }
});


function extractDisplayArrangements(nodes: DisplayNode[]): DisplayArrangementsState {
    return nodes
        .filter(node => node.type !== NodeType.PreviewDisplay)
        .reduce((acc, node) => {
        acc[node.id] = node.arrangement
        return acc
    }, {} as DisplayArrangementsState)
}

function sortIDsByOrder(size: "xs" | "md" | "lg", arrangements: DisplayArrangementsState): string[] {
    return Object.keys(arrangements)
        .sort((a, b) => {
            return arrangements[a][size].order - arrangements[b][size].order
        })
}


function shiftID(arr: string[], id: string, direction: "forward" | "backward") {
    const index = arr.indexOf(id)
    if (index === -1) return arr
    let newIndex = index + (direction === 'forward' ? 1 : -1)
    if (newIndex < 0 || newIndex >= arr.length) return arr
    let result = [...arr]
    result[index] = result[newIndex]
    result[newIndex] = id
    return result;
}


function setArrangeOrderByIndex(arrangements: DisplayArrangementsState, ids: string[], size: "xs" | "md" | "lg") {
    return ids.reduce((acc, id, index) => {
        const currentArrangement = acc[id];
        const updatedArrangement = {
            ...currentArrangement,
            [size]: {
                ...currentArrangement[size],
                order: index
            }
        };

        return {
            ...acc,
            [id]: updatedArrangement
        };
    }, {...arrangements})
}

export const {
    moveDisplay
} = displayArrangementsSlice.actions;
export const displayArrangementsReducer = displayArrangementsSlice.reducer;
