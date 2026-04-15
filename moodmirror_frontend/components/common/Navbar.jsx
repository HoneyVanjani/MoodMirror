import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, LogOut, BookOpen } from "lucide-react";
import { storage } from "../../utils/storage.js";
import { toast } from "./Toast.jsx";
import { useState, useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!storage.getAuth());
  const [userRole, setUserRole] = useState(storage.getAuth()?.role || null);

  useEffect(() => {
    const auth = storage.getAuth();
    if (auth && (!auth.token || !auth.id)) {
      storage.clearAuth();
      setIsAuthenticated(false);
      setUserRole(null);
    } else {
      setIsAuthenticated(!!auth);
      setUserRole(auth?.role || null);
    }
  }, []);

  useEffect(() => {
    const auth = storage.getAuth();
    if (auth && (!auth.token || !auth.id)) {
      storage.clearAuth();
      setIsAuthenticated(false);
      setUserRole(null);
    } else {
      setIsAuthenticated(!!auth);
      setUserRole(auth?.role || null);
    }
  }, [location]);

  const handleSignOut = () => {
    storage.clearAuth();
    setIsAuthenticated(false);
    setUserRole(null);
    toast.success("Signed out successfully");
    navigate("/");
  };

  const isPublicPage = ['/', '/about', '/login', '/register-choice'].includes(location.pathname);
  const isDashboardPage = ['/dashboard', '/activity', '/calendar', '/feedback', '/journal'].includes(location.pathname);

  if (isPublicPage && !isAuthenticated) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MoodMirror
            </span>
          </Link>
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`transition-colors hover:text-primary ${
                location.pathname === "/about" ? "text-primary font-medium" : "text-muted-foreground"
              }`}
            >
              About
            </Link>
            <div className="flex items-center space-x-2">
              <Link
                to="/register-choice"
                className="px-3 py-2 text-sm font-medium bg-gradient-primary text-white rounded-md hover:opacity-90 transition-opacity"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-background border border-border rounded-md hover:bg-accent transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (isAuthenticated && isDashboardPage) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="flex items-center justify-center w-8 h-8 bg-gradient-primary rounded-lg">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MoodMirror
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-background border border-border rounded-md hover:bg-accent transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
    );
  }

  

  return null;
};

export default Navbar;
