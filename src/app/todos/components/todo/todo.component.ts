import {
    Component,
    ElementRef,
    EventEmitter,
    inject,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
} from '@angular/core'
import { TodoInterface } from '../../types/todo.interface'
import { CommonModule } from '@angular/common'
import { TodosService } from '../../services/todos.service'
import { TodoDTO } from '../../../api/todos/models/todo.dto'

@Component({
    selector: 'app-todos-todo',
    standalone: true,
    imports: [ CommonModule ],
    templateUrl: './todo.component.html',
    styleUrl: './todo.component.css',
})
export class TodoComponent implements OnInit {
    @Input({ required: true }) todo!: TodoInterface
    @Input({ required: true }) isEditing!: boolean
    @Output() setEditingID: EventEmitter<string | null> = new EventEmitter()

    @ViewChild('textInput') textInput?: ElementRef

    todosService = inject(TodosService)
    editingText: string = ''

    ngOnInit (): void {
        this.editingText = this.todo.title
    }

    changeText (event: Event): void {
        const value = (event.target as HTMLInputElement).value
        this.editingText = value
    }

    changeTodo (): void {
        const dataToUpdate: TodoDTO = {
            title: this.editingText,
            description: this.todo.description,
            isCompleted: this.todo.isCompleted,
        }

        this.todosService
            .updateTodo(this.todo.id, dataToUpdate)
            .subscribe(updatedID => {
                this.todosService.changeTodo(
                    updatedID,
                    this.editingText,
                    this.todo.description
                )
            })

        this.setEditingID.emit(null)
    }

    setTodoInEditMode (): void {
        this.setEditingID.emit(this.todo.id)
    }

    removeTodo (): void {
        const todoID = this.todo.id

        this.todosService.deleteTodo(todoID).subscribe(() => {
            this.todosService.removeTodo(todoID)
        })
    }

    toggleTodo (): void {
        const dataToUpdate = {
            ...this.todo,
            isCompleted: !this.todo.isCompleted,
        }

        this.todosService
            .updateTodo(this.todo.id, dataToUpdate)
            .subscribe(() => {
                this.todosService.toggleTodo(this.todo.id)
            })
    }
}
