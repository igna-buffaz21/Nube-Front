
export interface FileRequest {
    file: any
    user_id: number,
    folder_id: number
}

export interface FileResponse {
    message: string,
    fileId: number
}

export interface ObtenerPesoFile {
    user_id: number
}

export interface ObtenerPesoFileResponse {
    message: string
}