import { Routes } from '@angular/router'
import { TodosComponent } from '../todos/todos.component'
import { RouterConstant } from './router.constant'
import { PageLoginComponent } from '../auth/page-login/page-login.component'
import { PageRegisterComponent } from '../auth/page-register/page-register.component'
import { authGuard } from '../api/auth/guard/auth.guard'

export const routes: Routes = [
    { path: RouterConstant.LOGIN, component: PageLoginComponent },
    { path: RouterConstant.REGISTER, component: PageRegisterComponent },
    {
        path: RouterConstant.TODOS,
        component: TodosComponent,
        canActivate: [ authGuard ],
    },
    { path: '**', redirectTo: RouterConstant.TODOS, pathMatch: 'full' },
]
