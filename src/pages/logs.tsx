import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { TableComponent } from "@/components/tablecomponent"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export const iframeHeight = "800px"

export const description = "A sidebar with a header and a search form."

export default function LogsPage() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <TableComponent>
                
            </TableComponent>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}