import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {Formula} from "../types/Formula";
import {apiBaseUrl} from "../config/config";

export const apiService = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
    endpoints: (builder) => ({
        getCalculators: builder.query<Formula[], void>({
            query: () => 'getCalculators'
            // transformResponse: (response: {data: Formula[]}, nodeMeta, arg) => response.data,
            // transformErrorResponse: (response: {status: string | number}, nodeMeta, arg) => response.status,
        }),
        addCalculator: builder.mutation<void, Formula>({
            query: (body) => ({
                url: 'addCalculator',
                method: 'POST',
                body,
            }),
        }),
    }),
})



