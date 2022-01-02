import { http } from './http';
import type { RegisterForm, LoginForm, ProfileForm } from '$lib/models/accounts/forms';
import type { Profile } from '$lib/models/accounts';
import type { LoginPackage } from '$lib/models/auth';
import type { Observable } from 'rxjs';
import { throwError, of, from, take } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { baseUrl } from '$lib/util';

/*
});*/

export function login(formInfo: LoginForm): Observable<LoginPackage> {
    return from(http.post<LoginPackage>(`${baseUrl}/auth/login`, formInfo)).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}

export function register(formInfo: RegisterForm): Observable<LoginPackage> {
    return from(http.post<LoginPackage>(`${baseUrl}/auth/register`, formInfo)).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}

export function logout(): Observable<void> {
    return from(http.get<void>(`${baseUrl}/auth/logout`)).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}

export function refreshToken(): Observable<string | null> {
    return from(http.get<{ newToken: string }>(`${baseUrl}/auth/refresh-token`)).pipe(
        take(1),
        map((res) => {
            return res.data.newToken;
        }),
        catchError((err) => {
            if (err.status === 403) {
                return of(null);
            } else {
                return throwError(err);
            }
        }),
    );
}

export function addProfile(formInfo: ProfileForm): Observable<Profile> {
    return from(http.post<Profile>(`${baseUrl}/auth/add-pseudonym`, formInfo)).pipe(
        take(1),
        map((res) => {
            return res.data;
        }),
    );
}
