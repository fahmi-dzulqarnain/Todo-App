import { inject, Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { RouterConstant } from './router.constant'

@Injectable({
    providedIn: 'root',
})
export class RouterService {
    private router = inject(Router)

    todos = () => {
        this.router.navigateByUrl(RouterConstant.TODOS)
    }

    auth = {
        login: () => {
            this.router.navigateByUrl(RouterConstant.LOGIN)
        },
        register: () => {
            this.router.navigateByUrl(RouterConstant.REGISTER)
        },
    }
}
