import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {apiBaseUrl} from "@skogkalk/common/dist/src/config/config";
import {Calculator} from "@skogkalk/common/dist/src/types/Calculator";

export const apiService = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: apiBaseUrl,
        prepareHeaders: headers => {
            headers.set('X-No-Cache', 'true') // ensure service worker do not return stale data
        },
    }),
    endpoints: (builder) => ({
        getCalculatorsInfo: builder.query<Calculator[], void>({
            query: () => 'getCalculatorsInfo',
        }),
        getCalculatorSchema: builder.query<Calculator["reteSchema"], {name: string, version: number}>({
            query: ({name, version}) => `getCalculatorSchema?name=${name}&version=${version}`,

        }),
        addCalculator: builder.mutation<void, {calculator: Calculator, token: string}>({
            query: ({calculator, token}) => ({
                url: `addCalculator`,
                method: 'POST',
                body: calculator,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
        }),
    }),
})



