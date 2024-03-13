import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {apiBaseUrl} from "@skogkalk/common/dist/src/config/config";
import {TreeState} from "@skogkalk/common/dist/src/parseTree";

export const apiService = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
    endpoints: (builder) => ({
        getCalculators: builder.query<TreeState, void>({
            query: () => 'getCalculators',
            // transformResponse: (response: {data: Formula[]}, nodeMeta, arg) => response.data,
            // transformErrorResponse: (response: {status: string | number}, nodeMeta, arg) => response.status,
        }),
        getCalculator: builder.query<TreeState, {name: string}>({
            query: ({name}) => `getCalculator?name=${name}`,
            transformResponse: (response: TreeState[]) => response[0],
        }),
        addCalculator: builder.mutation<void, TreeState>({
            query: (body) => ({
                url: 'addCalculator',
                method: 'POST',
                body,
            }),
        }),
    }),
})



