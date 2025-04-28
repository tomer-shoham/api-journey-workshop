import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar.tsx";
import { Bell } from "lucide-react";
import { Button } from "../ui/button.tsx";
import { googleLogout } from "@react-oauth/google";
import { useToast } from "../ui/use-toast.ts";
import { useNavigate } from "react-router-dom";

export function Header({ user, setIsAuthenticated }) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    googleLogout();
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have successfully logged out."
    });
    navigate("/login");
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-blue-600 shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        <h1 className="text-xl font-semibold text-white">Leumi Asset Platform</h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative hover:bg-blue-700 text-white">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger className="hover:opacity-80 transition-opacity">
              <Avatar>
                {user?.picture ? (
                  <AvatarImage src={user.picture} alt={user.name} />
                ) : (
                  <AvatarFallback className="bg-blue-700 text-white">
                    {user?.name
                      ?.split(" ")
                      .map(n => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleLogout}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
