import * as React from "react"
import {
  Command,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { getUserId } from "@/auth/jwt"
import { authService } from "@/services/authService"
import type { UserResponse } from "@/interfaces/register.interface"


const data = {
  navMain: [
    {
      title: "Plataforma",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Archivos",
          url: "/home",
        },
        {
          title: "Almacenamiento",
          url: "/storage",
        },
        {
          title: "Logs",
          url: "/logs",
        },
      ],
    }
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState<UserResponse>()
  const [userId, setUserId] = React.useState<number | null>(0)

  function obtenerId() {

    setUserId(getUserId())

  }

  async function obtenerDataUsuario() {
    try {
      const userr = await authService.getData(userId!!);

      setUser(userr)
    }
    catch(error) {
      console.log("ERROR AL TRAER DATA DEL USER " + error)
    }
  }

  React.useEffect(() => {
    obtenerId()
    }, []
  )

  React.useEffect(() => {
    if (userId != 0) {
      obtenerDataUsuario()
    }
    }, [userId]
  )


  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user!!} />
      </SidebarFooter>
    </Sidebar>
  )
}
