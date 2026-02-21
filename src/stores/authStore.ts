import { create } from "zustand";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => void;
  clearError: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("access_token"),
  isAuthenticated: !!localStorage.getItem("access_token"),
  isLoading: false,
  error: null,

  // ✅ LOGIN
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Login failed. Please try again.",
      });
      throw error;
    }
  },

  // ✅ REGISTER
  register: async (FullName, email, password) => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ FullName, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      localStorage.setItem("access_token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.accessToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || "Registration failed. Please try again.",
      });
      throw error;
    }
  },

  // ✅ LOGOUT
  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  // ✅ LOAD USER (on refresh)
 loadUser: () => {
  const stored = localStorage.getItem("user");
  const token = localStorage.getItem("access_token");

  if (!stored || stored === "undefined" || !token) {
    return;
  }

  try {
    const parsedUser = JSON.parse(stored);

    set({
      user: parsedUser,
      token,
      isAuthenticated: true,
    });
  } catch (error) {
    console.error("Invalid user in localStorage. Clearing...");
    localStorage.removeItem("user");
  }
},

  clearError: () => set({ error: null }),

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));