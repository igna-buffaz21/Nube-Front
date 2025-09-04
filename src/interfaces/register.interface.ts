export interface RegisterRequest {
    nombre: string,
    email: string,
    phone: string,
    password: string
}

export interface RegisterResponse {
    message: string,
    userId: number
}