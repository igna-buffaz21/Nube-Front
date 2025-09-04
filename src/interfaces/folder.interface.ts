export interface FolderRequest {
    user_id: number;
    parent_id: number;
}

export interface FolderResponse {
    carpetas: Array<Folder>
    archivos: Array<File>
}

export interface Folder {
    id: number,
    user_id: number,
    name: string,
    parent_id: number,
    created_at: number,
    path: string
}

export interface File {
    id: number,
    user_id: number,
    original_name: string,
    stored_name: string,
    path: string,
    mime_type: string,
    size: number,
    created_at: number,
    folder_id: number
}

export interface PostFolderRequest {
    user_id: number,
    nombre: string,
    parent_id: number
}