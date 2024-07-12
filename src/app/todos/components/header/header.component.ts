import { Component, inject } from '@angular/core'
import { TodosService } from '../../services/todos.service'

@Component({
    selector: 'app-todos-header',
    standalone: true,
    imports: [],
    templateUrl: './header.component.html',
    styleUrl: '../../todos.component.css',
})
export class HeaderComponent {
    todoService = inject(TodosService)
    title: string = ''
    description: string = ''

    changeTitle (event: KeyboardEvent): void {
        const target = event.target as HTMLInputElement
        this.title = target.value
    }

    changeDescription (event: KeyboardEvent): void {
        const target = event.target as HTMLInputElement
        this.description = target.value
    }

    addTodo (): void {
        this.todoService.addTodo(this.title, this.description).subscribe(() => {
            this.title = ''
            this.description = ''

            this.todoService.getTodos().subscribe(todos => {
                this.todoService.todosSignal.set(todos.dataList)
            })
        })
    }
}
