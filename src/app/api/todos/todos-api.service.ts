import { HttpStatusCode } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { APIResponse } from '../types/api-response.type'
import { Observable } from 'rxjs'
import { TodoInterface } from '../../todos/types/todo.interface'
import { TodoDTO } from './models/todo.dto'
import { StringUUID } from '../types/string-uuid.type'
import { DataResponse } from '../types/data-response.type'
import { ApiService } from '../api.service'

@Injectable({ providedIn: 'root' })
export class TodosAPIService {
    apiService = inject(ApiService)
    endpoint = 'todo'

    getAllTodos (): Observable<DataResponse<TodoInterface>> {
        const page = 1
        const limit = 20
        const keyword = ''
        const endpointWithParams = `${this.endpoint}?page=${page}&limit=${limit}&keyword=${keyword}`

        return new Observable(subscriber => {
            this.apiService
                .get<APIResponse<DataResponse<TodoInterface>>>(
                    endpointWithParams
                )
                .subscribe({
                    next: response => {
                        if (response.statusCode === 200) {
                            subscriber.next(response.data)
                            subscriber.complete()
                        } else {
                            subscriber.error(response)
                        }
                    },
                    error: error => {
                        console.error(error)
                        subscriber.error(error.error)
                    },
                })
        })
    }

    createTodo (dto: TodoDTO): Observable<TodoInterface> {
        return new Observable(subscriber => {
            this.apiService
                .post<APIResponse<TodoInterface>>(this.endpoint, dto)
                .subscribe({
                    next: response => {
                        if (response.statusCode === 201) {
                            subscriber.next(response.data)
                            subscriber.complete()
                        } else {
                            subscriber.error(response.error)
                        }
                    },
                    error: (error: APIResponse<null>) => {
                        console.error(error)
                        subscriber.error(error.error)
                    },
                })
        })
    }

    updateTodo (todoID: StringUUID, dto: TodoDTO): Observable<StringUUID> {
        return new Observable(subscriber => {
            this.apiService
                .patch<APIResponse<StringUUID>>(
                    `${this.endpoint}/${todoID}`,
                    dto
                )
                .subscribe({
                    next: response => {
                        const data = response.data

                        if (response.statusCode === HttpStatusCode.Ok) {
                            subscriber.next(data)
                            subscriber.complete()
                        } else {
                            subscriber.error(
                                `No data received from the server: ${response.message}`
                            )
                        }
                    },
                    error: (error: APIResponse<null>) => {
                        console.error(error)
                        subscriber.error(error.error)
                    },
                })
        })
    }

    deleteTodo (todoID: StringUUID): Observable<StringUUID> {
        return new Observable(subscriber => {
            this.apiService
                .delete<APIResponse<StringUUID>>(`${this.endpoint}/${todoID}`)
                .subscribe({
                    next: response => {
                        if (response.statusCode === HttpStatusCode.Ok) {
                            subscriber.next(response.data)
                            subscriber.complete()
                        } else {
                            subscriber.error(response.error)
                        }
                    },
                    error: (error: APIResponse<null>) => {
                        console.error(error)
                        subscriber.error(error.error)
                    },
                })
        })
    }
}
