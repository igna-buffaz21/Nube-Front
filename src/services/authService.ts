import type { LoginRequest, LoginResponse } from "@/interfaces/login.interface";
import api from "./api";
import type { RegisterRequest, RegisterResponse, UserResponse } from "@/interfaces/register.interface";

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        const response = await api.post<LoginResponse>('/usuarios/iniciarSesion', data);
        return response.data;
    },

    async register(data: RegisterRequest): Promise<RegisterResponse> {
        const response = await api.post<RegisterResponse>('/usuarios/crearUsuario', data);

        return response.data
    },

    async getData(id: number): Promise<UserResponse> {
        const response = await api.get<UserResponse>('/usuarios/obtenerDatosUsuario?id=' + id)

        return response.data
    }
}