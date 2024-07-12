import { Component, inject, OnInit } from '@angular/core'
import { HeaderComponent } from './components/header/header.component'
import { MainComponent } from './components/main/main.component'
import { FooterComponent } from './components/footer/footer.component'
import { TodosService } from './services/todos.service'

@Component({
    selector: 'app-todos',
    standalone: true,
    imports: [ HeaderComponent, MainComponent, FooterComponent ],
    templateUrl: './todos.component.html',
    styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit {
    todosService = inject(TodosService)

    ngOnInit (): void {
        this.todosService.getTodos().subscribe(todos => {
            this.todosService.todosSignal.set(todos.dataList)
        })
    }
}
