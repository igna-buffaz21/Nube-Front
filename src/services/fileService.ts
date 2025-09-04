import api from "./api";
import type { FileResponse, ObtenerPesoFile, ObtenerPesoFileResponse } from "@/interfaces/file.interface";

export const fileService = {
    async subirArchivo(data: FormData): Promise<FileResponse> {
        const response = await api.post<FileResponse>('/archivos/guardarArchivo', data);
        return response.data;
    },

    async obtenerAlmacenamientoUsado(data: ObtenerPesoFile) : Promise<ObtenerPesoFileResponse> {
        const response = await api.get<ObtenerPesoFileResponse>('/archivos/obtenerPesoPorUsuario?user_id=' + data.user_id)
        return response.data
    }
}