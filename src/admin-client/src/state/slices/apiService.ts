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
        getCalculatorSchema: builder.query<Calculator["reteSchema"], {name: string, version: number}>({
            query: ({name, version}) => `getCalculatorSchema?name=${name}&version=${version}`,

        }),
        addCalculator: builder.mutation<void, Calculator>({
            query: (body) => ({
                url: `addCalculator`,
                method: 'POST',
                body,
            }),
        }),
    }),
})



