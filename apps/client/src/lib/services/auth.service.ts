import { http } from './http';
import type { RegisterForm, LoginForm, ProfileForm } from '$lib/models/accounts/forms';
import type { Profile } from '$lib/models/accounts';
import type { LoginPackage } from '$lib/models/auth';
import { baseUrl } from '$lib/util';

export async function login(formInfo: LoginForm): Promise<LoginPackage> {
    return http.post<LoginPackage>(`${baseUrl}/auth/login`, formInfo).then((res) => {
        return res.data;
    });
}

export async function register(formInfo: RegisterForm): Promise<LoginPackage> {
    return http.post<LoginPackage>(`${baseUrl}/auth/register`, formInfo).then((res) => {
        return res.data;
    });
}

export async function logout(): Promise<void> {
    return http.get<void>(`${baseUrl}/auth/logout`).then(() => {
        return;
    });
}

export async function refreshToken(): Promise<string | null> {
    return http
        .get<{ newToken: string }>(`${baseUrl}/auth/refresh-token`)
        .then((res) => {
            return res.data.newToken;
        })
        .catch((err) => {
            console.log(err);
            return null;
        });
}

export async function addProfile(formInfo: ProfileForm): Promise<Profile> {
    return http.post<Profile>(`${baseUrl}/auth/add-pseudonym`, formInfo).then((res) => {
        return res.data;
    });
}
