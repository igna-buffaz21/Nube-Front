import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Label } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { fileService } from '@/services/fileService';
import type { ObtenerPesoFile } from '@/interfaces/file.interface';
import toast from 'react-hot-toast';
import { getUserId } from '@/auth/jwt';

export function StorageChart() {
    const [usedSpaceB, setusedSpaceB] = useState(0)

    const [usedSpaceMB, setusedSpaceMB] = useState(0)

    const [user_id, setUserId] = useState<number | null>(0)

    const maxSpaceGB = 1;
    const maxSpaceMB = maxSpaceGB * 1024; // 15GB en MB
    const availableSpaceMB = maxSpaceMB - usedSpaceMB;
    const usedPercentage = (usedSpaceMB / maxSpaceMB) * 100;

  function obtenerId() {

    setUserId(getUserId())

  }
    async function obtenerAlmacenamientoUsado() {
        try {
            const data: ObtenerPesoFile = {
                user_id: user_id!!
            }

            const response = await fileService.obtenerAlmacenamientoUsado(data)

            console.log(response)

            setusedSpaceB(Number(response.message))
        }
        catch (error) {
            toast.error("Error al obtener el Almacenamiento usado")
            console.log(error)
        }
    }

    useEffect(() => {
        obtenerId()
    }, []
    )

    
    useEffect(() => {
        if (user_id != undefined && user_id != 0){
            console.log("USER ID: " + user_id)
            obtenerAlmacenamientoUsado()
          }
    }, [user_id]
    )

    useEffect(() => {
        console.log(usedSpaceB)

        setusedSpaceMB(usedSpaceB / (1024 * 1024))

    }, [usedSpaceB]
    )

    const chartData = [
        { 
            browser: "usado", 
            visitors: usedSpaceMB, 
            fill: usedPercentage >= 90 ? "#ef4444" : usedPercentage >= 75 ? "#f97316" : usedPercentage >= 50 ? "#eab308" : "#3b82f6" 
        },
        { 
            browser: "disponible", 
            visitors: Math.max(0, availableSpaceMB), 
            fill: "#e5e7eb" 
        },
    ]

    const chartConfig = {
        visitors: {
            label: "Espacio",
        },
        usado: {
            label: "Usado",
            color: chartData[0].fill,
        },
        disponible: {
            label: "Disponible",
            color: "#e5e7eb",
        },
    }
    return (
        <div className="flex justify-center items-center w-full h-full">
            <Card className="flex flex-col border-0 shadow-none bg-transparent">
                <CardHeader className="items-center pb-0 text-center">
                    <CardTitle className="text-center">Almacenamiento Utilizado</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 pb-0">
                    <ChartContainer
                        config={chartConfig}
                        className="mx-auto aspect-square max-h-[250px]"
                    >
                        <PieChart>
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                            />
                            <Pie
                                data={chartData}
                                dataKey="visitors"
                                nameKey="browser"
                                innerRadius={60}
                                strokeWidth={5}
                            >
                                <Label
                                    content={({ viewBox }) => {
                                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                            return (
                                                <text
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    textAnchor="middle"
                                                    dominantBaseline="middle"
                                                >
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={viewBox.cy}
                                                        className="fill-foreground text-3xl font-bold"
                                                    >
                                                        {usedPercentage.toFixed(1)}%
                                                    </tspan>
                                                    <tspan
                                                        x={viewBox.cx}
                                                        y={(viewBox.cy || 0) + 24}
                                                        className="fill-muted-foreground"
                                                    >
                                                        usado
                                                    </tspan>
                                                </text>
                                            )
                                        }
                                    }}
                                />
                            </Pie>
                        </PieChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 leading-none font-medium">
                        Espacio utilizado: {(usedSpaceMB / 1024).toFixed(2)} GB de {maxSpaceGB} GB <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground leading-none">
                        {(availableSpaceMB / 1024).toFixed(2)} GB disponibles
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}