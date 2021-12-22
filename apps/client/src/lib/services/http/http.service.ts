import Axios from 'axios';
import type { AxiosInstance, AxiosPromise, AxiosResponse } from 'axios';
import { from, Observable, throwError } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';
import type { HttpOptions } from './http-options';

/**
 * Borrowed heavily from NestJS's HTTP Service implementation.
 *
 * Source: https://github.com/nestjs/nest/blob/master/packages/common/http/http.service.ts
 */
export class HttpService {
    private axiosInstance: AxiosInstance = Axios.create({
        timeout: 1000,
        //xsrfCookieName: 'XSRF-TOKEN',
        withCredentials: true,
    });

    private static generateObservable<T>(
        Axios: (...args: unknown[]) => AxiosPromise<T>,
        ...args: unknown[]
    ): Observable<AxiosResponse<T>> {
        return from(Axios(...args)).pipe(take(1));
    }

    public handleRequest<T>(
        response: Observable<AxiosResponse<T>>,
        onSuccess: (success: AxiosResponse<T>) => void = null,
        onError: (error: unknown) => void = null,
    ): Observable<T> {
        return response.pipe(
            map((resp) => {
                if (onSuccess) {
                    onSuccess(resp);
                }
                return resp.data;
            }),
            catchError((err) => {
                if (onError) {
                    onError(err);
                }
                return throwError(err);
            }),
        );
    }

    public request<T = unknown>(config: HttpOptions): Observable<AxiosResponse<T>> {
        return HttpService.generateObservable<T>(this.instance.request, config);
    }

    public get<T = unknown>(url: string, config?: HttpOptions): Observable<AxiosResponse<T>> {
        return HttpService.generateObservable<T>(this.instance.get, `${url}`, config);
    }

    public delete<T = unknown>(url: string, config?: HttpOptions): Observable<AxiosResponse<T>> {
        return HttpService.generateObservable<T>(this.instance.delete, `${url}`, config);
    }

    public head<T = unknown>(url: string, config?: HttpOptions): Observable<AxiosResponse<T>> {
        return HttpService.generateObservable<T>(this.instance.head, `${url}`, config);
    }

    public post<T = unknown>(
        url: string,
        data: unknown,
        config?: HttpOptions,
    ): Observable<AxiosResponse<T>> {
        return HttpService.generateObservable<T>(this.instance.post, `${url}`, data, config);
    }

    public put<T = unknown>(
        url: string,
        data: unknown,
        config?: HttpOptions,
    ): Observable<AxiosResponse<T>> {
        return HttpService.generateObservable<T>(this.instance.put, `${url}`, data, config);
    }

    public patch<T = unknown>(
        url: string,
        data: unknown,
        config?: HttpOptions,
    ): Observable<AxiosResponse<T>> {
        return HttpService.generateObservable<T>(this.instance.patch, `${url}`, data, config);
    }

    public get instance(): AxiosInstance {
        return this.axiosInstance;
    }
}
