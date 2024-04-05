import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {apiBaseUrl} from "@skogkalk/common/dist/src/config/config";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";
import {ParseNode} from "@skogkalk/common/dist/src/parseTree";

export const apiService = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
    endpoints: (builder) => ({
        getCalculatorsInfo: builder.query<Calculator[], void>({
            query: () => 'getCalculatorsInfo',
            transformResponse: (data: Calculator[]) => data.filter(c => c.published)
        }),
        getCalculatorsInfoIncludingUnpublished: builder.query<Calculator[], void>({
            query: () => 'getCalculatorsInfo',
        }),
        getCalculatorTree: builder.query<ParseNode[], {name: string, version: number}>({
            query: ({name, version}) => `getCalculatorTree?name=${name}&version=${version}`,
        }),
    }),
})



