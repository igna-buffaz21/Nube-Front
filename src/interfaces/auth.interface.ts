import type { UserPayload } from "./jwt.interface";

export interface AuthContextType {
    user: UserPayload | null;
    login: (token: string) => void;
    logout: () => void;
    loading: boolean; // 👈 nueva propiedad
}