import type {FetchError, FetchResponse, SearchParameters} from 'ofetch';
import {hash} from 'ohash';
import type {AsyncData, UseFetchOptions} from '#app';
import type {KeysOf} from '#app/composables/asyncData';
type UrlType = string | Request | Ref<string | Request> | (() => string | Request);

type HttpOption<T> = UseFetchOptions<ResOptions<T>, T, KeysOf<T>, any>;
interface ResOptions<T> {
    data: T;
    code: number;
    message: boolean;
    err?: string[];
}

function handleError<T>(
    _method: string | undefined,
    _response: FetchResponse<ResOptions<T>> & FetchResponse<any>,
) {
    // Implement error handling logic here
    if (_response?._data?.statusCode === 401) { 
      // setUser('')
    }
    console.error(`[useHttp] [error] ${_method}:`, _response);
}

function checkRef(obj: Record<string, any>) {
    return Object.keys(obj).some(key => isRef(obj[key]));
}

function fetch<T>(url: UrlType, opts: HttpOption<T>) {
    // Check the `key` option
    const { key, params, watch } = opts;
    if (!key && ((params && checkRef(params)) || (watch && checkRef(watch))))
        console.error('\x1B[31m%s\x1B[0m %s', '[useHttp] [error]', 'The `key` option is required when `params` or `watch` has ref properties, please set a unique key for the current request.');

    const options = opts as UseFetchOptions<ResOptions<T>>;
    options.lazy = options.lazy ?? true;

    // const { baseUrl } = useRuntimeConfig().public;

    return useFetch<ResOptions<T>>(url, {
        // Set the cache key
        key: key ?? hash(['api-fetch', url, JSON.stringify({ method: options.method, params: options.params })]),
        // Merge the options
        ...options,
        $fetch: useNuxtApp().$api as any,
    });
}

export const $http = {
    get: <T>(url: UrlType, params?: SearchParameters, option?: HttpOption<T>) => {
        return fetch<T>(url, { method: 'get', params, ...option });
    },

    post: <T>(url: UrlType, body?: RequestInit['body'] | Record<string, any>, option?: HttpOption<T>) => {
        return fetch<T>(url, { method: 'post', body, ...option });
    },

    put: <T>(url: UrlType, body?: RequestInit['body'] | Record<string, any>, option?: HttpOption<T>) => {
        return fetch<T>(url, { method: 'put', body, ...option });
    },
    
    delete: <T>(url: UrlType, body?: RequestInit['body'] | Record<string, any>, option?: HttpOption<T>) => {
        return fetch<T>(url, { method: 'delete', body, ...option });
    },
};

export default function UseHttp() {
    return {
        $http,
    };
}