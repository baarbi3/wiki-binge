import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "../components/Sidebar/AppSidebar";

export const metadata = {
  title: "Wikibinge ⋅ Feed",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SidebarProvider>
        <AppSidebar/>
          <SidebarInset>
            <SidebarTrigger/>
            {children}
          </SidebarInset>
      </SidebarProvider>
    </>
  );
}