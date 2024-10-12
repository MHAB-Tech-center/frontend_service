/* eslint-disable @typescript-eslint/no-explicit-any */
import { getErrorMessage } from "@/lib/utils";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { login } from "./useApi";
interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  gender: string;
  national_id: string;
  phonenumber: string;
}

interface IAuthContext {
  user: IUser | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean | null;
}
const AuthContext = createContext<IAuthContext | undefined>(undefined);

// export const nonProtectedRoutes = [
//   "/auth/login",
//   "/auth/forgot-password",
//   "/auth/reset-password",
// ];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const authenticateUser = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data: response } = await login(email, password);
      console.log(import.meta.env.DEV && response);
      Cookies.set("token", response.data.access);
      localStorage.setItem(import.meta.env.VITE_LOCAL_STORAGE_PREFIX, JSON.stringify(response.data.user));
      setUser(response.data.user);
      setIsAuthenticated(true);
      toast.success("Login successful");
      window.location.href = "/";
    } catch (error: any) {
      console.log(import.meta.env.DEV && error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  const logout = () => {
    Cookies.remove("token");
    localStorage.removeItem(import.meta.env.VITE_LOCAL_STORAGE_PREFIX);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  useEffect(() => {
    const user = localStorage.getItem(import.meta.env.VITE_LOCAL_STORAGE_PREFIX);
    if (user) {
      try {
        setUser(JSON.parse(user));
      } catch (error) {
        console.log(import.meta.env.DEV && error);
      }
    }
    const token = Cookies.get("token");
    setIsAuthenticated(Boolean(token));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: authenticateUser,
        logout,
        loading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
