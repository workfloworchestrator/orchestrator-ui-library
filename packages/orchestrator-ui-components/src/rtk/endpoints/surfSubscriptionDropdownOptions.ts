import { Option } from '@/components/WfoForms/formFields/types';
import { SUBSCRIPTION_DROPDOWN_OPTIONS_ENDPOINT } from '@/configuration';
import { BaseQueryTypes, orchestratorApi } from '@/rtk';
import { FilterParams } from '@/types';

// Custom endpoint used by the deprecated SubscriptionField formfield.
// Has to be present in the library for now.
// In the future, pydantic-forms will make it possible to add/override custom endpoints in the app implementation.

/**
 * Serialize URL parameters object to a string.
 *
 * @param params Object with url parameters, values can be scalar or array, i.e. {a: [1, 2], b: [3], c: 4}
 * @returns the url parameter string, i.e. ?a=1&a=2&b=3&c=4
 */
export function toUrlParams(params: Record<string, unknown>): string {
    const urlParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (Array.isArray(value)) {
            value.forEach((v) => {
                urlParams.append(key, String(v));
            });
        } else if (value !== undefined) {
            urlParams.append(key, String(value));
        }
    });

    return urlParams.toString();
}

const surfSubscriptionDropdownOptionsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getSurfSubscriptionDropdownOptions: build.query<
            Option<string>[],
            { params: FilterParams }
        >({
            query: ({ params }) => ({
                url: SUBSCRIPTION_DROPDOWN_OPTIONS_ENDPOINT,
                params: params,
            }),
            extraOptions: {
                baseQueryType: BaseQueryTypes.fetch,
                paramsSerializer: toUrlParams,
            },
        }),
    }),
});

export const {
    useGetSurfSubscriptionDropdownOptionsQuery,
    useLazyGetSurfSubscriptionDropdownOptionsQuery,
} = surfSubscriptionDropdownOptionsApi;
