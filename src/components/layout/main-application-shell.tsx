import {
  BarChart3,
  FileText,
  Menu,
  User,
  UserRoundCog,
  Users,
  X,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/base/button";
import { useOnLoad } from "@/hooks/useApi";
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/base/dropdown-menu";
import ProfileModal from "@/components/modals/profile";

const sidebarItems = [
  {
    to: "/",
    icon: BarChart3,
    label: "Overview",
    permissions: ["report.view"],
  },
  {
    to: "/report",
    icon: FileText,
    label: "Report",
    permissions: ["any"],
  },
  {
    to: "/inspectors",
    icon: Users,
    label: "Inspectors",
    permissions: ["any"],
  },
  {
    to: "/roles",
    icon: User,
    label: "Roles",
    permissions: ["roles.view", "roles.write"],
  },
  {
    to: "/rmb-staff",
    icon: UserRoundCog,
    label: "RMB Staff",
    permissions: ["rmb.view", "rmb.invite", "rmb.write"],
  },
];

const Sidebar = ({ items }: { items: typeof sidebarItems }) => {
  const location = useLocation();

  return (
    <nav className="mt-8 space-y-2">
      {items.map((item, index) => {
        const isActive =
          location.pathname === item.to ||
          (location.pathname.startsWith(item.to) &&
            location.pathname[item.to.length] === "/");

        return (
          <Link
            key={index}
            to={item.to}
            className={`flex items-center space-x-2 rounded-lg px-4 py-2 ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default function MainAppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, user, isAllowed, logout } = useAuth();
  const { onLoad } = useOnLoad();

  useEffect(() => {
    console.log('user', user)
    if (isAuthenticated === false) {
      if (import.meta.env.VITE_APP_FORCE_LOGIN === "true" || !user)
        window.location.href = "/login";
    } else {
      onLoad();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);
  return (
    <div className="relative flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 w-64 transform bg-white p-6 shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Inspection Manual Report</h1>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <Sidebar
          items={sidebarItems.filter((item) => item.permissions.includes('any') || isAllowed(item.permissions, "or"))}
        />
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100">
        <div className="flex items-center justify-between bg-white p-4 shadow-md lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <h1 className="text-xl font-bold">Inspection Manual Report</h1>
        </div>
        <div className="p-8 w-full">
          <div className="mb-8 flex items-center justify-between rounded-md bg-white py-6 px-4">
            <h2 className="text-2xl font-semibold">Overview</h2>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex flex-col gap-0 cursor-pointer">
                    <div className="text-sm font-semibold">
                      {user?.rmbRole?.rtbRoleName ?? 'RMB'}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <ProfileModal />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="rounded-lg bg-white p-6 shadow min-h-[80vh] ">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
