import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '../../api/auth/auth.service'
import { RouterService } from '../../router/router.service'

@Component({
    selector: 'app-page-register',
    standalone: true,
    imports: [ ReactiveFormsModule ],
    templateUrl: './page-register.component.html',
    styleUrl: './page-register.component.css',
})
export class PageRegisterComponent {
    formBuilder = inject(FormBuilder)
    authService = inject(AuthService)
    routeTo = inject(RouterService)

    form = this.formBuilder.nonNullable.group({
        email: [ '', [ Validators.email, Validators.required ] ],
        password: [ '', Validators.required ],
        fullName: [ '', Validators.required ],
    })
    errorMessage: string | null = null

    onSubmit () {
        if (this.form.invalid) {
            this.errorMessage = 'Please fill in all fields'
            return
        }

        const registerDTO = this.form.getRawValue()

        this.authService.register(registerDTO).subscribe({
            next: () => {
                this.routeTo.auth.login()
            },
            error: error => {
                this.errorMessage = error.message
            },
        })
    }
}
