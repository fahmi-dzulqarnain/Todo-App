import { Component, inject } from '@angular/core'
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { SignInDTO } from '../../api/auth/model/dto/sign-in.dto'
import { AuthService } from '../../api/auth/auth.service'
import { RouterService } from '../../router/router.service'

@Component({
    selector: 'app-page-login',
    standalone: true,
    imports: [ ReactiveFormsModule, RouterModule ],
    templateUrl: './page-login.component.html',
    styleUrl: './page-login.component.css',
})
export class PageLoginComponent {
    authService = inject(AuthService)
    routeTo = inject(RouterService)
    formBuilder = inject(FormBuilder)
    form = this.formBuilder.nonNullable.group({
        email: [ '', [ Validators.email, Validators.required ] ],
        password: [ '', Validators.required ],
    })
    errorMessage: string | null = null

    onSubmit (): void {
        if (this.form.invalid) {
            this.errorMessage = 'Please fill in all fields properly'
            return
        }

        const value: SignInDTO = this.form.getRawValue()

        this.authService.login(value).subscribe({
            next: () => {
                this.routeTo.todos()
            },
            error: error => {
                this.errorMessage = error.message
            },
        })
    }
}
