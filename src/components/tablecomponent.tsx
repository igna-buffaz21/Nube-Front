import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import type { ActivityLog } from "@/interfaces/logs.interface";
import { logsService } from "@/services/logsService";
import { useEffect, useState } from "react"
import { getUserId } from "@/auth/jwt";

export function TableComponent() {

    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [user_id, setUserId] = useState<number | null>(0)
  

    useEffect(() => {
        obtenerId()
    }, [] 
);

    useEffect(() => {
      obtenerLogs(user_id!)
    }, [user_id] 
);


    async function obtenerLogs(userId: number) {
        try {
            const response = await logsService.obtenerLogs(userId);

            setLogs(response);

            console.log("LOGS OBTENIDOS: ", response);
        }
        catch(error) {
            console.log("ERROR AL TRAER LOGS: " + error)
        }
    }

      function obtenerId() {
    
        setUserId(getUserId())
    
      }

    return (
        <Table>
          <TableCaption>Historial de actividades del usuario</TableCaption>
    
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>IP</TableHead>
            </TableRow>
          </TableHeader>
    
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell>{new Date(log.date).toLocaleString()}</TableCell>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>{log.ip}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No hay registros todavía
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      );
}