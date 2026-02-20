import api from "./api";
import type {
  User,
  LoginPayload,
  RegisterPayload,
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "@/types";

// ── Simulated delay ──
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// ── Simulated in-memory data ──
let mockTasks: Task[] = [
  {
    id: "1",
    title: "Set up project architecture",
    description: "Initialize the frontend project with proper folder structure and tooling.",
    status: "completed",
    createdAt: "2026-02-18T10:00:00Z",
    updatedAt: "2026-02-18T14:00:00Z",
  },
  {
    id: "2",
    title: "Implement authentication flow",
    description: "Build login and register pages with JWT-based auth.",
    status: "completed",
    createdAt: "2026-02-18T14:00:00Z",
    updatedAt: "2026-02-19T09:00:00Z",
  },
  {
    id: "3",
    title: "Build dashboard layout",
    description: "Create responsive dashboard with sidebar navigation and navbar.",
    status: "pending",
    createdAt: "2026-02-19T09:00:00Z",
    updatedAt: "2026-02-19T09:00:00Z",
  },
  {
    id: "4",
    title: "Add task CRUD operations",
    description: "Implement create, read, update, and delete for tasks with optimistic updates.",
    status: "pending",
    createdAt: "2026-02-19T10:00:00Z",
    updatedAt: "2026-02-19T10:00:00Z",
  },
  {
    id: "5",
    title: "Write unit tests",
    description: "Add comprehensive test coverage for critical components and hooks.",
    status: "pending",
    createdAt: "2026-02-20T08:00:00Z",
    updatedAt: "2026-02-20T08:00:00Z",
  },
];

const mockUser: User = {
  id: "usr_1",
  name: "Alex Johnson",
  email: "alex@example.com",
  createdAt: "2026-01-15T08:00:00Z",
};

let nextId = 6;

// ── Auth service (simulated) ──
export const authService = {
  async login(payload: LoginPayload) {
    await delay(800);
    // Simulate: any email/password works
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated";
    return { accessToken: token, user: { ...mockUser, email: payload.email } };
  },

  async register(payload: RegisterPayload) {
    await delay(1000);
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.simulated";
    return {
      accessToken: token,
      user: { ...mockUser, name: payload.name, email: payload.email },
    };
  },

  async getProfile(): Promise<User> {
    await delay(500);
    const stored = localStorage.getItem("user");
    if (stored) return JSON.parse(stored);
    return mockUser;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    await delay(600);
    const stored = localStorage.getItem("user");
    const current = stored ? JSON.parse(stored) : mockUser;
    const updated = { ...current, ...data };
    localStorage.setItem("user", JSON.stringify(updated));
    return updated;
  },
};

// ── Task service (simulated) ──
export const taskService = {
  async getAll(): Promise<Task[]> {
    await delay(600);
    return [...mockTasks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async create(payload: CreateTaskPayload): Promise<Task> {
    await delay(400);
    const task: Task = {
      id: String(nextId++),
      title: payload.title,
      description: payload.description,
      status: "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTasks.unshift(task);
    return task;
  },

  async update(id: string, payload: UpdateTaskPayload): Promise<Task> {
    await delay(400);
    const idx = mockTasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error("Task not found");
    mockTasks[idx] = {
      ...mockTasks[idx],
      ...payload,
      updatedAt: new Date().toISOString(),
    };
    return mockTasks[idx];
  },

  async remove(id: string): Promise<void> {
    await delay(300);
    mockTasks = mockTasks.filter((t) => t.id !== id);
  },
};
