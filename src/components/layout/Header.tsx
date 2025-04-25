import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserAvatar } from "../ui/user-avatar";
import {
  Search,
  Bell,
  Menu,
  LogOut,
  User,
  LogIn,
  UserPlus,
  Home,
  BookOpen,
  Network,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "../ui/theme-toggle";
import NotificationPopover from "../common/NotificationPopover";

export function Header() {
  const { user, logout, isGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
    },
    {
      name: "Network",
      href: "/network",
      icon: <Network className="h-4 w-4 mr-2" />,
    },
    {
      name: "Mentorship",
      href: "/mentorship",
      icon: <GraduationCap className="h-4 w-4 mr-2" />,
    },
    {
      name: "AI Assistant",
      href: "/assistant",
      icon: <Sparkles className="h-4 w-4 mr-2" />,
    },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center md:gap-4 md:mr-6">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="mb-4">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className="justify-start"
                    asChild
                    onClick={closeMobileMenu}
                  >
                    <Link to={item.href}>
                      {item.icon}
                      {item.name}
                    </Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          <Link
            to="/"
            className="flex items-center gap-2 font-semibold text-xl text-foreground"
          >
            <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
            <span className="hidden sm:inline">Alumni Nexus</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-1 ml-2">
          {navItems.map((item) => (
            <Button
              key={item.name}
              variant={isActive(item.href) ? "default" : "ghost"}
              asChild
            >
              <Link to={item.href}>{item.name}</Link>
            </Button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* Theme Toggle */}
          <ThemeToggle />
          
          {!isMobile && (
            <form className="relative mr-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search..."
                className="rounded-full bg-background pl-8 pr-3 py-2 text-sm border border-input focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </form>
          )}

          {user ? (
            <>
              <NotificationPopover />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                    aria-label="User menu"
                  >
                    <UserAvatar />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {isGuest ? "Guest User" : user.name || "User"}
                    {isGuest && (
                      <p className="text-xs font-normal text-muted-foreground">
                        Limited access
                      </p>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {isGuest && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/login" className="cursor-pointer">
                          <LogIn className="h-4 w-4 mr-2" />
                          Sign In
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/register" className="cursor-pointer">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Register
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link to="/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Link>
              </Button>
              <Button asChild>
                <Link to="/register">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
