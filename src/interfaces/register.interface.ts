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

export interface User {
    email: string;
    name: string;
  }
  
export interface UserResponse {
    user: User;
}