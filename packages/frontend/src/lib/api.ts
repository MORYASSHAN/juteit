const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getHeaders = (options: any = {}) => {
    const token = localStorage.getItem('token');
    const headers: any = {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    // Don't set Content-Type if it's FormData, browser will set it with boundary
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    return headers;
};

export const api = {
    get: async (endpoint: string, params: any = {}, options: any = {}) => {
        const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = new URL(`${baseUrl}${cleanEndpoint}`, window.location.origin);
        Object.keys(params).forEach(key => {
            if (params[key]) url.searchParams.append(key, params[key]);
        });

        const response = await fetch(url.toString(), {
            ...options,
            headers: getHeaders(options),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    post: async (endpoint: string, data: any, options: any = {}) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = new URL(`${baseUrl}${cleanEndpoint}`, window.location.origin);
        const response = await fetch(url.toString(), {
            method: 'POST',
            ...options,
            headers: getHeaders({ ...options, body }),
            body,
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    put: async (endpoint: string, data: any, options: any = {}) => {
        const body = data instanceof FormData ? data : JSON.stringify(data);
        const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = new URL(`${baseUrl}${cleanEndpoint}`, window.location.origin);
        const response = await fetch(url.toString(), {
            method: 'PUT',
            ...options,
            headers: getHeaders({ ...options, body }),
            body,
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },

    delete: async (endpoint: string, options: any = {}) => {
        const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const url = new URL(`${baseUrl}${cleanEndpoint}`, window.location.origin);
        const response = await fetch(url.toString(), {
            method: 'DELETE',
            ...options,
            headers: getHeaders(options),
        });
        if (!response.ok) throw new Error(await response.text());
        return response.json();
    },
};
