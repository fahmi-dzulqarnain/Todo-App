import { UserInterface } from './user.interface'

export interface LoginResponse {
    accessToken: string
    user: UserInterface
}
