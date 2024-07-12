import { Component, computed, inject } from '@angular/core'
import { TodosService } from '../../services/todos.service'
import { FilterEnum } from '../../types/filter.enum'
import { TodoComponent } from '../todo/todo.component'
import { CommonModule } from '@angular/common'
import { forkJoin } from 'rxjs'
import { TodoDTO } from '../../../api/todos/models/todo.dto'

@Component({
    selector: 'app-todos-main',
    standalone: true,
    imports: [ CommonModule, TodoComponent ],
    templateUrl: './main.component.html',
    styleUrl: './main.component.css',
})
export class MainComponent {
    todosService = inject(TodosService)
    todosList = computed(() => {
        const todos = this.todosService.todosSignal()
        const filter = this.todosService.filterSignal()

        switch (filter) {
            case FilterEnum.active:
                return todos.filter(todo => !todo.isCompleted)
            case FilterEnum.completed:
                return todos.filter(todo => todo.isCompleted)
            case FilterEnum.all:
                return todos
        }
    })

    noTodosClass = computed(() => this.todosService.todosSignal().length === 0)

    isAllTodosSelected = computed(() => {
        this.todosService.todosSignal().every(todo => todo.isCompleted)
    })

    editingID: string | null = null

    setEditingID (editingID: string | null): void {
        this.editingID = editingID
    }

    toggleAllTodos (event: Event): void {
        const target = event.target as HTMLInputElement
        const request$ = this.todosService.todosSignal().map(todo => {
            const dataToUpdate: TodoDTO = {
                title: todo.title,
                description: todo.description,
                isCompleted: target.checked,
            }

            this.todosService.updateTodo(todo.id, dataToUpdate)
        })

        forkJoin([ request$ ]).subscribe(() => {
            this.todosService.toggleAllTodo(target.checked)
        })
    }
}
