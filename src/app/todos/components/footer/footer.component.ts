import { Component, computed, inject } from '@angular/core'
import { TodosService } from '../../services/todos.service'
import { FilterEnum } from '../../types/filter.enum'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-todos-footer',
    standalone: true,
    imports: [ CommonModule ],
    templateUrl: './footer.component.html',
    styleUrl: '../../todos.component.css',
})
export class FooterComponent {
    todosService = inject(TodosService)
    filter = this.todosService.filterSignal
    filterEnum = FilterEnum
    activeCount = computed(() => {
        return this.todosService.todosSignal().filter(todo => !todo.isCompleted)
            .length
    })
    noTodosClass = computed(() => this.todosService.todosSignal().length === 0)

    itemsLeftText = computed(() => {
        return `item${this.activeCount() !== 1 ? 's' : ''} left`
    })

    changeFilter (event: Event, filterName: FilterEnum): void {
        event.preventDefault()
        this.todosService.changeFilter(filterName)
    }
}
