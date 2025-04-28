import { LayoutDashboard, Wallet, ArrowLeftRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar.tsx";

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, url: "/" },
  { title: "Assets", icon: Wallet, url: "/assets" },
  { title: "Transactions", icon: ArrowLeftRight, url: "/transactions" }
];

export function AppSidebar() {
  const location = useLocation();
  const { open, setOpen } = useSidebar();

  return (
      <Sidebar
          className="border-r border-sidebar-border bg-sidebar shadow-lg h-screen flex flex-col transition-all duration-300"
          collapsible="icon"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
      >
        <SidebarContent className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-6 flex items-center justify-between">
            <SidebarTrigger className="group-data-[collapsible=icon]:block" />
          </div>

          {/* Sidebar Menu */}
          <SidebarGroup className="flex-grow">
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                      <SidebarMenuItem key={item.title} className="relative">
                        <SidebarMenuButton asChild>
                          <Link
                              to={item.url}
                              className={`sidebar-item flex items-center gap-3 px-6 py-3 text-sidebar-foreground transition-all duration-300 hover:bg-gray-200 ${
                                  isActive ? "border-l-4 border-blue-500 bg-gray-100" : ""
                              }`}
                          >
                            {isActive && (
                                <span className="absolute left-0 top-0 h-full w-[4px] bg-blue-500 transition-all duration-300"></span>
                            )}
                            <item.icon className="h-5 w-5" />
                            <span
                                className={`font-medium transition-transform duration-300 origin-left ${
                                    open ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
                                }`}
                            >
                          {item.title}
                        </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
  );
}
