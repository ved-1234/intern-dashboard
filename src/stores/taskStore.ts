import { create } from "zustand";
import type { Task, CreateTaskPayload, UpdateTaskPayload } from "@/types";
import { taskService } from "@/services/dataService";

interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filterStatus: "all" | "pending" | "completed";
  fetchTasks: () => Promise<void>;
  createTask: (payload: CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, payload: UpdateTaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setSearchQuery: (q: string) => void;
  setFilterStatus: (s: "all" | "pending" | "completed") => void;
  filteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  filterStatus: "all",

  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const tasks = await taskService.getAll();
      set({ tasks, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Failed to load tasks" });
    }
  },

  createTask: async (payload) => {
    // Optimistic
    const tempId = `temp_${Date.now()}`;
    const optimistic: Task = {
      id: tempId,
      ...payload,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((s) => ({ tasks: [optimistic, ...s.tasks] }));
    try {
      const real = await taskService.create(payload);
      set((s) => ({ tasks: s.tasks.map((t) => (t.id === tempId ? real : t)) }));
    } catch {
      set((s) => ({ tasks: s.tasks.filter((t) => t.id !== tempId), error: "Failed to create task" }));
    }
  },

  updateTask: async (id, payload) => {
    const prev = get().tasks;
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...payload, updatedAt: new Date().toISOString() } : t)),
    }));
    try {
      await taskService.update(id, payload);
    } catch {
      set({ tasks: prev, error: "Failed to update task" });
    }
  },

  deleteTask: async (id) => {
    const prev = get().tasks;
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    try {
      await taskService.remove(id);
    } catch {
      set({ tasks: prev, error: "Failed to delete task" });
    }
  },

  setSearchQuery: (q) => set({ searchQuery: q }),
  setFilterStatus: (s) => set({ filterStatus: s }),

  filteredTasks: () => {
    const { tasks, searchQuery, filterStatus } = get();
    return tasks.filter((t) => {
      const matchesSearch =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === "all" || t.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  },
}));
