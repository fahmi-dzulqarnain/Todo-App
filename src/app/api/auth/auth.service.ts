import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { Constants } from '../config/constant'
import { APIResponse } from '../types/api-response.type'
import { catchError, lastValueFrom, Observable } from 'rxjs'
import { SignInDTO } from './model/dto/sign-in.dto'
import { LoginResponse } from './model/login-response.model'
import { SignUpDTO } from './model/dto/sign-up.dto'
import { ApiService } from '../api.service'

@Injectable({ providedIn: 'root' })
export class AuthService {
    apiService = inject(ApiService)
    httpClient = inject(HttpClient)
    endpoint = `${Constants.API_ENDPOINT}/auth/`
    isTokenValid = false

    register (dto: SignUpDTO): Observable<void> {
        return new Observable(subscriber => {
            this.httpClient
                .post<APIResponse<null>>(`${this.endpoint}signUp`, dto)
                .subscribe({
                    next: response => {
                        if (response.statusCode === 201) {
                            subscriber.next()
                            subscriber.complete()
                        } else {
                            subscriber.error(response)
                        }
                    },
                    error: (error: APIResponse<null>) => {
                        console.error(error)
                        subscriber.error(error.error)
                    },
                })
        })
    }

    login (dto: SignInDTO): Observable<void> {
        return new Observable(subscriber => {
            this.httpClient
                .post<APIResponse<LoginResponse>>(`${this.endpoint}signIn`, dto)
                .subscribe({
                    next: response => {
                        const data = response.data

                        if (data) {
                            this.apiService.setAuthToken(data.accessToken)

                            subscriber.next()
                            subscriber.complete()
                        } else {
                            subscriber.error(
                                `No data received from the server: ${response.message}`
                            )
                        }
                    },
                    error: (error: APIResponse<null>) => {
                        subscriber.error(error.error)
                    },
                })
        })
    }

    async validateToken (token: string): Promise<boolean> {
        const body = { token }
        const response = await lastValueFrom(
            this.httpClient
                .post<APIResponse<boolean>>(
                    `${this.endpoint}isTokenValid`,
                    body
                )
                .pipe(
                    catchError(() => {
                        this.isTokenValid = false
                        return [ { data: this.isTokenValid } ]
                    })
                )
        )

        return response.data ?? false
    }
}
