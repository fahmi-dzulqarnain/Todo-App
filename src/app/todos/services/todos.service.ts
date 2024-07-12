import { inject, Injectable, signal } from '@angular/core'
import { TodoInterface } from '../types/todo.interface'
import { FilterEnum } from '../types/filter.enum'
import { TodosAPIService } from '../../api/todos/todos-api.service'
import { Observable } from 'rxjs'
import { DataResponse } from '../../api/types/data-response.type'
import { TodoDTO } from '../../api/todos/models/todo.dto'

@Injectable({
    providedIn: 'root',
})
export class TodosService {
    todosAPIService = inject(TodosAPIService)
    todosSignal = signal<TodoInterface[]>([])
    filterSignal = signal<FilterEnum>(FilterEnum.all)

    getTodos (): Observable<DataResponse<TodoInterface>> {
        return this.todosAPIService.getAllTodos()
    }

    addTodo (title: string, description: string): Observable<TodoInterface> {
        return this.todosAPIService.createTodo({
            title,
            description,
            isCompleted: false,
        })
    }

    deleteTodo (todoID: string): Observable<string> {
        return this.todosAPIService.deleteTodo(todoID)
    }

    removeTodo (id: string): void {
        this.todosSignal.update(todos => todos.filter(todo => todo.id !== id))
    }

    updateTodo (todoID: string, todoToBeUpdated: TodoDTO): Observable<string> {
        return this.todosAPIService.updateTodo(todoID, todoToBeUpdated)
    }

    changeTodo (id: string, title: string, description: string): void {
        this.todosSignal.update(todos =>
            todos.map(todo =>
                todo.id === id ? { ...todo, title, description } : todo
            )
        )
    }

    changeFilter (filterName: FilterEnum): void {
        this.filterSignal.set(filterName)
    }

    toggleTodo (id: string): void {
        this.todosSignal.update(todos =>
            todos.map(todo =>
                todo.id === id
                    ? { ...todo, isCompleted: !todo.isCompleted }
                    : todo
            )
        )
    }

    toggleAllTodo (isCompleted: boolean): void {
        this.todosSignal.update(todos =>
            todos.map(todo => ({ ...todo, isCompleted }))
        )
    }
}
