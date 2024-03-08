import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Page {
    title: string;
    ordering: number;
    subPages: string[];
}

export interface PagesState {
    pages: Page[];
}

function updateOrdering(pages: Page[]) {
    pages.forEach((page, index) => {
        page.ordering = index;
    });
}


export const pageSlice = createSlice({
    name: 'pages',
    initialState: {
        pages: []
    } as PagesState,
    reducers: {
        addPage: (state, action: PayloadAction<Page> ) => {
            action.payload.ordering = state.pages.length;
            state.pages.push(action.payload);
        },
        removePage: (state, action: PayloadAction<number>) => {
            const tail = state.pages.slice(action.payload + 1);
            state.pages = state.pages.slice(0, action.payload);
            state.pages.push(...tail);
            updateOrdering(state.pages);
        },
        updatePage: (state, action: PayloadAction<Page>) => {
            state.pages[action.payload.ordering] = action.payload;
        },
        movePage: (state, action: PayloadAction<{oldIndex: number, newIndex: number}>) => {
            const {oldIndex, newIndex} = action.payload;
            if(newIndex < 0 || newIndex >= state.pages.length) return;
            [state.pages[oldIndex], state.pages[newIndex]] =
                [state.pages[newIndex], state.pages[oldIndex]];
            updateOrdering(state.pages);
        }
    }
});

export const {addPage, removePage, updatePage, movePage} = pageSlice.actions;
export const pagesReducer = pageSlice.reducer;
