import Axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { HttpOptions } from './http-options';
import { token, refreshToken, logout } from '$lib/repo/session.repo';

const http: AxiosInstance = Axios.create({
    timeout: 1000,
    timeoutErrorMessage: 'Request timed out!',
    withCredentials: true,
});

http.interceptors.request.use((request) => {
    console.log(`Request interceptor hit!`);
    if (token()) {
        request.headers.authorization = `Bearer ${token()}`;
    }
    return request;
});

http.interceptors.response.use((response) => {
    console.log(`Response interceptor hit!`);
    if (response.status === 401) {
        refreshToken().subscribe({
            error: (err) => {
                console.log(err);
                logout().subscribe();
            },
        });
    }
    return response;
});

export async function request<T = unknown>(
    config: HttpOptions,
): Promise<AxiosResponse<T, unknown>> {
    return http.request<T>(config);
}

export async function get<T = unknown>(
    url: string,
    config?: HttpOptions,
): Promise<AxiosResponse<T, unknown>> {
    return http.get<T>(url, config);
}

export async function deleteReq<T = unknown>(
    url: string,
    config?: HttpOptions,
): Promise<AxiosResponse<T, unknown>> {
    return http.delete<T>(url, config);
}

export async function head<T = unknown>(
    url: string,
    config?: HttpOptions,
): Promise<AxiosResponse<T, unknown>> {
    return http.head<T>(url, config);
}

export async function post<T = unknown>(
    url: string,
    data: unknown,
    config?: HttpOptions,
): Promise<AxiosResponse<T, unknown>> {
    return http.post<T>(url, data, config);
}

export async function put<T = unknown>(
    url: string,
    data: unknown,
    config?: HttpOptions,
): Promise<AxiosResponse<T, unknown>> {
    return http.put<T>(url, data, config);
}

export async function patch<T = unknown>(
    url: string,
    data: unknown,
    config?: HttpOptions,
): Promise<AxiosResponse<T, unknown>> {
    return http.patch<T>(url, data, config);
}
