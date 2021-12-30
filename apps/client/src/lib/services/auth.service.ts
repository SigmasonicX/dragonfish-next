import http from './http';
import type { RegisterForm, LoginForm, ProfileForm } from '$lib/models/accounts/forms';
import type { Profile } from '$lib/models/accounts';
import type { LoginPackage } from '$lib/models/auth';
import type { Observable } from 'rxjs';
import { throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { token } from '$lib/repo/session.repo';

http.instance.interceptors.request.use((request) => {
    console.log(`Request interceptor hit!`);
    if (token()) {
        request.headers.authorization = `Bearer ${token()}`;
    }
    return request;
});

const baseUrl =
    process.env.NODE_ENV === 'production'
        ? `https://api.offprint.net/api`
        : `http://127.0.0.1:3333/api`;

export function login(formInfo: LoginForm): Observable<LoginPackage> {
    return http.handleRequest(
        http.post<LoginPackage>(`${baseUrl}/auth/login`, formInfo, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}

export function register(formInfo: RegisterForm): Observable<LoginPackage> {
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

export function refreshToken(): Observable<string | null> {
    return http
        .get<{ newToken: string }>(`${this.baseUrl}/auth/refresh-token`, {
            observe: 'response',
            withCredentials: true,
        })
        .pipe(
            map((user) => {
                return user.data.newToken;
            }),
            catchError((err) => {
                if (err.status === 403) {
                    // A 403 means that the refreshToken has expired, or we didn't send one up at all, which is Super Suspicious
                    return of<string>(null);
                }
                return throwError(err);
            }),
        );
}

export function addProfile(formInfo: ProfileForm): Observable<Profile> {
    return http.handleRequest(
        http.post<Profile>(`${this.baseUrl}/auth/add-pseudonym`, formInfo, {
            observe: 'response',
            withCredentials: true,
        }),
    );
}
