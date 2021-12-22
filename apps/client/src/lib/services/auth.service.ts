import http from '../http';
import type { AccountForm, Login } from '@dragonfish/models';
import type { LoginPackage } from '$lib/models/auth';
import type { Observable } from 'rxjs';

http.instance.interceptors.request.use((request) => {
    request.headers.authorization = `Bearer ${`a token`}`;
    return request;
});

const baseUrl =
    process.env.NODE_ENV === 'production'
        ? `https://api.offprint.net/api`
        : `http://127.0.0.1:3333/v1/api`;

export function login(formInfo: Login): Observable<LoginPackage> {
    return http.handleRequest(
        http.post<LoginPackage>(`${baseUrl}/auth/login`, formInfo, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}

export function register(formInfo: AccountForm): Observable<LoginPackage> {
    return http.handleRequest(
        http.post<LoginPackage>(`${baseUrl}/auth/register`, formInfo, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}

export function logout(): Observable<void> {
    return http.handleRequest(
        http.get<void>(`${baseUrl}/auth/logout`, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}
