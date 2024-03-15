import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {apiBaseUrl} from "@skogkalk/common/dist/src/config/config";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";

export const apiService = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
    endpoints: (builder) => ({
        getCalculatorsInfo: builder.query<Calculator[], void>({
            query: () => 'getCalculatorsInfo',
            // transformResponse: (response: {data: Formula[]}, nodeMeta, arg) => response.data,
            // transformErrorResponse: (response: {status: string | number}, nodeMeta, arg) => response.status,
        }),
        addCalculator: builder.mutation<void, {name: string, version: string}>({
            query: (body) => ({
                url: `addCalculator?name=${body.name}&version=${body.version}`,
                method: 'POST',
                body,
            }),
        }),
    }),
})



