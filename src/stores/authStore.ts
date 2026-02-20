import { create } from "zustand";
import type { User } from "@/types";
import { authService } from "@/services/dataService";

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

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { accessToken, user } = await authService.login({ email, password });
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      set({
        isLoading: false,
        error: e?.response?.data?.message || "Login failed. Please try again.",
      });
      throw e;
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { accessToken, user } = await authService.register({ name, email, password });
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, token: accessToken, isAuthenticated: true, isLoading: false });
    } catch (e: any) {
      set({
        isLoading: false,
        error: e?.response?.data?.message || "Registration failed. Please try again.",
      });
      throw e;
    }
  },

  logout: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: () => {
    const stored = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (stored && token) {
      set({ user: JSON.parse(stored), token, isAuthenticated: true });
    }
  },

  clearError: () => set({ error: null }),

  setUser: (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    set({ user });
  },
}));
