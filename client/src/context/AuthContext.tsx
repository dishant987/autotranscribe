import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  exp?: number; // Token expiration time (UNIX timestamp)
}

interface AuthContextType {
  token: string;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const base64UrlDecode = (str: string) => {
  // Replace base64url chars with base64 chars
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  // Pad string with '=' to make length divisible by 4
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
};

export const decodeToken = (token: string): User | null => {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(base64UrlDecode(payload));

    return decoded;
  } catch (error) {
    console.error("Invalid token format", error);
    return null;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const initialToken = localStorage.getItem("token") || "";
  const initialUser = initialToken ? decodeToken(initialToken) : null;

  const [token, setToken] = useState<string>(initialToken);
  const [user, setUser] = useState<User | null>(initialUser);

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleAutoLogout = (exp?: number) => {
    if (!exp) return;

    const expiresIn = exp * 1000 - Date.now(); // Convert to milliseconds
    if (expiresIn <= 0) {
      logout();
      return;
    }

    timeoutRef.current = setTimeout(() => {
      logout();
    }, expiresIn);
  };

  const login = (newToken: string) => {
    const extractedUser = decodeToken(newToken);
    if (extractedUser) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(extractedUser);
      scheduleAutoLogout(extractedUser.exp);
    }
  };

  useEffect(() => {
    // On mount: schedule logout if there's a valid token
    if (user?.exp) {
      scheduleAutoLogout(user.exp);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
