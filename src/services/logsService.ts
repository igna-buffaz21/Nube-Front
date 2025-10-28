import type { ActivityLog } from "@/interfaces/logs.interface";
import api from "./api";

export const logsService = {
    async obtenerLogs(user_id: number): Promise<ActivityLog[]> {
        const response = await api.get<ActivityLog[]>('/logger/obtenerLogsPorUsuario?user_id=' + user_id);

        return response.data;
    }
}