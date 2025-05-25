import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { BackendURL } from "@/contents/content";
import { toast } from "sonner";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { token, user, logout } = useAuth();
  // After mounting, we can safely show the UI that depends on the theme
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // For demo purposes, toggle login state
  const handleLogout = async () => {
    await axios.post(BackendURL + "/api/auth/logout");
    toast.success("Logged out successfully", {
      description: "You have been logged out of your account.",
    });
    logout();
  };

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold">EduVid</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {/* Placeholder for theme toggle */}
            <div className="h-9 w-9"></div>
          </div>
        </div>
      </header>
    );
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`sticky top-0 z-50 w-full border-b backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-200 ${
        isScrolled ? "bg-background/95 shadow-sm" : "bg-background/50"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-primary"
            >
              EduVid
            </motion.span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary relative group ${
              isActive("/") ? "text-primary" : ""
            }`}
          >
            Home
            <span
              className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
                isActive("/") ? "w-full" : "w-0 group-hover:w-full"
              }`}
            ></span>
          </Link>
          {token ? (
            <Link
              to="/upload"
              className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                isActive("/upload") ? "text-primary" : ""
              }`}
            >
              Upload
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
                  isActive("/upload") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ) : null}
          {token ? (
            <Link
              to="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                isActive("/dashboard") ? "text-primary" : ""
              }`}
            >
              Dashboard
              <span
                className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all ${
                  isActive("/dashboard") ? "w-full" : "w-0 group-hover:w-full"
                }`}
              ></span>
            </Link>
          ) : null}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="rounded-full p-2 bg-muted flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </motion.button>

          {token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32&text=JD"
                      alt="@user"
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || ""}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                  <Link to="/profile" className="flex w-full">
                    Profile
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuItem>
                  <Link to="/dashboard" className="flex w-full">
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem>
                  <Link to="/settings" className="flex w-full">
                    Settings
                  </Link>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild variant="outline" className="ml-2">
                  <Link to="/login">Login</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </motion.div>
            </>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="mr-2 rounded-full p-2 bg-muted flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </motion.button>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-4 mt-8">
                <Link
                  to="/"
                  className="text-lg font-medium transition-colors hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
                {token && (
                  <Link
                    to="/upload"
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Upload
                  </Link>
                )}
                {token && (
                  <Link
                    to="/dashboard"
                    className="text-lg font-medium transition-colors hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}
                <div className="flex flex-col gap-2 mt-4">
                  {token ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src="/placeholder.svg?height=32&width=32&text=JD"
                            alt="@user"
                          />
                          <AvatarFallback>
                            {user?.name?.charAt(0) || ""}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleLogout();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild variant="outline">
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                          Login
                        </Link>
                      </Button>
                      <Button asChild>
                        <Link to="/signup" onClick={() => setIsOpen(false)}>
                          Sign Up
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}
