import http from './http';
import type { AccountForm, Login } from '@dragonfish/models';
import type { LoginPackage } from '$lib/models/auth';
import type { Observable } from 'rxjs';
import { token } from '$lib/repo/session.repo';

http.instance.interceptors.request.use((request) => {
    if (token()) {
        request.headers.authorization = `Bearer ${token()}`;
    }
    return request;
});

const baseUrl =
    process.env.NODE_ENV === 'production'
        ? `https://api.offprint.net/api`
        : `http://127.0.0.1:3333/api`;

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
