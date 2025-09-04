import type { FolderRequest, FolderResponse, PostFolderRequest } from "@/interfaces/folder.interface";
import api from "./api";

export const folderService = {
    async obtenerCarpetas(data: FolderRequest): Promise<FolderResponse> {
        const response = await api.get<FolderResponse>('/carpetas/obtenerCarpetas?user_id=' + data.user_id + '&parent_id=' + data.parent_id);
        return response.data;
    },

    async crearCarpeta(data: PostFolderRequest): Promise<any> {
        const response = await api.post<any>('/carpetas/crearCarpeta', data)
        return response.data
    }
}