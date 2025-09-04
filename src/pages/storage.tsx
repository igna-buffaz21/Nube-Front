import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { StorageChart } from "@/components/stadistics";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export function Storage() {
    return(
        <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
                <StorageChart></StorageChart>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>    
    )
}