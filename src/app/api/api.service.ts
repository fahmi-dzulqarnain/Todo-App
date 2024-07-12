import { inject, Injectable, signal } from '@angular/core'
import { HttpClient, HttpHeaders, HttpStatusCode } from '@angular/common/http'
import { Observable } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'
import { Constants } from './config/constant'
import { RouterService } from '../router/router.service'

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private http = inject(HttpClient)
    private apiUrl: string = Constants.API_ENDPOINT
    private authToken = signal<string>('')
    private routeTo = inject(RouterService)

    setAuthToken (token: string): void {
        this.authToken.set(token)
        sessionStorage.setItem('accessToken', token)
    }

    private getHeaders (): HttpHeaders {
        const token =
            this.authToken() == ''
                ? sessionStorage.getItem('accessToken')
                : this.authToken()

        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        })
    }

    get<T> (endpoint: string): Observable<T> {
        const headers = this.getHeaders()

        return this.http.get<T>(`${this.apiUrl}/${endpoint}`, { headers }).pipe(
            tap(response =>
                console.log(`GET request to ${endpoint} successful:`, response)
            ),
            catchError(error => {
                console.error(`Error in GET request to ${endpoint}:`, error)

                if (error.status === HttpStatusCode.Unauthorized) {
                    this.handleUnauthorized()
                }

                throw error
            })
        )
    }

    post<T> (endpoint: string, body: any): Observable<T> {
        const headers = this.getHeaders()

        return this.http
            .post<T>(`${this.apiUrl}/${endpoint}`, body, { headers })
            .pipe(
                tap(response =>
                    console.log(
                        `POST request to ${endpoint} successful:`,
                        response
                    )
                ),
                catchError(error => {
                    console.error(
                        `Error in POST request to ${endpoint}:`,
                        error
                    )

                    if (error.status === HttpStatusCode.Unauthorized) {
                        this.handleUnauthorized()
                    }

                    throw error
                })
            )
    }

    put<T> (endpoint: string, body: any): Observable<T> {
        const headers = this.getHeaders()

        return this.http
            .put<T>(`${this.apiUrl}/${endpoint}`, body, { headers })
            .pipe(
                tap(response =>
                    console.log(
                        `PUT request to ${endpoint} successful:`,
                        response
                    )
                ),
                catchError(error => {
                    console.error(`Error in PUT request to ${endpoint}:`, error)

                    if (error.status === HttpStatusCode.Unauthorized) {
                        this.handleUnauthorized()
                    }

                    throw error
                })
            )
    }

    patch<T> (endpoint: string, body: any): Observable<T> {
        const headers = this.getHeaders()

        return this.http
            .patch<T>(`${this.apiUrl}/${endpoint}`, body, { headers })
            .pipe(
                tap(response =>
                    console.log(
                        `PATCH request to ${endpoint} successful:`,
                        response
                    )
                ),
                catchError(error => {
                    console.error(
                        `Error in PATCH request to ${endpoint}:`,
                        error
                    )

                    if (error.status === HttpStatusCode.Unauthorized) {
                        this.handleUnauthorized()
                    }

                    throw error
                })
            )
    }

    delete<T> (endpoint: string): Observable<T> {
        const headers = this.getHeaders()

        return this.http
            .delete<T>(`${this.apiUrl}/${endpoint}`, { headers })
            .pipe(
                tap(response =>
                    console.log(
                        `DELETE request to ${endpoint} successful:`,
                        response
                    )
                ),
                catchError(error => {
                    console.error(
                        `Error in DELETE request to ${endpoint}:`,
                        error
                    )

                    if (error.status === HttpStatusCode.Unauthorized) {
                        this.handleUnauthorized()
                    }

                    throw error
                })
            )
    }

    private handleUnauthorized (): void {
        this.authToken.set('')
        sessionStorage.removeItem('accessToken')
        this.routeTo.auth.login()
    }
}
