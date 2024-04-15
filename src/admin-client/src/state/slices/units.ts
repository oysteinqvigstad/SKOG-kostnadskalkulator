import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Unit {
    name: string;
    ordering: number;
}

export interface UnitsState {
    units: { id: number, unit: Unit }[];
}

function updateOrdering(unitsWithID: { id: number, unit: Unit }[]) {
    unitsWithID.forEach(({id, unit}, index) => {
        unit.ordering = index;
    });
}

export const unitSlice = createSlice({
    name: 'units',
    initialState: {
        units: []
    } as UnitsState,
    reducers: {
        setUnitsState: (state, action: PayloadAction<UnitsState>) => {
            return action.payload;
        },
        addUnit: (state, action: PayloadAction<Unit>) => {
            action.payload.ordering = state.units.length;
            state.units.push({id: (Math.random() * 1000000 + 1000000), unit: action.payload});
        },
        removeUnit: (state, action: PayloadAction<number>) => {
            const tail = state.units.slice(action.payload + 1);
            state.units = state.units.slice(0, action.payload);
            state.units.push(...tail);
            updateOrdering(state.units);
        },
        updateUnit: (state, action: PayloadAction<Unit>) => {
            state.units[action.payload.ordering].unit = action.payload;
        },
        moveUnit: (state, action: PayloadAction<{ oldIndex: number, newIndex: number }>) => {
            const {oldIndex, newIndex} = action.payload;
            if (newIndex < 0 || newIndex >= state.units.length) return;
            [state.units[oldIndex], state.units[newIndex]] =
                [state.units[newIndex], state.units[oldIndex]];
            updateOrdering(state.units);
        }
    }
})

export const {
    setUnitsState,
    addUnit,
    removeUnit,
    updateUnit,
    moveUnit } = unitSlice.actions;
export const unitsReducer = unitSlice.reducer;