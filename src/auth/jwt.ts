import type { UserPayload } from "@/interfaces/jwt.interface";

export function setToken(token: string): void {
    localStorage.setItem("token", token);
  }
  
  export function getToken(): string | null {
    return localStorage.getItem("token");
  }
  
  export function removeToken(): void {
    localStorage.removeItem("token");
  }

  export function getUserId(): number | null {

   const token = localStorage.getItem("token");

   if (token != null || token != undefined || token != "") {
    const payload = decodeToken(token!!)
    return Number(payload!!.id)
   }
   else {
    return null
   }

  }
  
  export function decodeToken(token: string): UserPayload | null {
    try {
      const base64Payload = token.split(".")[1];
      const json = atob(base64Payload);
      const payload = JSON.parse(json) as UserPayload;
      return payload;
    } catch (e) {
      return null;
    }
  }
  
  export function isTokenValid(token: string | null): boolean {
    if (!token) return false;
    const payload = decodeToken(token);
    if (!payload) return false;
    return payload.exp * 1000 > Date.now();
  }
  
  /** Conviene tener esto a mano para leer el usuario actual desde el storage */
  export function getUserFromStorage(): UserPayload | null {
    const token = getToken();
    if (!isTokenValid(token)) return null;
    return decodeToken(token!);
  }