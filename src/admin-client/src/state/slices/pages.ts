import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Page {
    title: string;
    ordering: number;
    subPages: string[];
}

export interface PagesState {
    pages: {id: number, page:Page}[];
}

function updateOrdering(pagesWithID: {id: number, page: Page}[]) {
    pagesWithID.forEach(( {id, page}, index) => {
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
            state.pages.push({id: ( Math.random() * 1000000 + 1000000), page: action.payload});
        },
        removePage: (state, action: PayloadAction<number>) => {
            const tail = state.pages.slice(action.payload + 1);
            state.pages = state.pages.slice(0, action.payload);
            state.pages.push(...tail);
            updateOrdering(state.pages);
        },
        updatePage: (state, action: PayloadAction<Page>) => {
            state.pages[action.payload.ordering].page = action.payload;
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
