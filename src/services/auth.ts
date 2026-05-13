import { api } from "@/lib/api";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  role?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

function extractToken(data: Record<string, unknown>): string | null {
  if (typeof data.accessToken === "string") return data.accessToken;
  if (typeof data.access_token === "string") return data.access_token;
  if (typeof data.token === "string") return data.token;
  if (typeof data.jwt === "string") return data.jwt;
  return null;
}

function extractUser(data: Record<string, unknown>): AuthUser | null {
  const user = data.user ?? data.data;
  if (user && typeof user === "object" && !Array.isArray(user)) {
    return user as AuthUser;
  }
  return null;
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return {};
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(""),
    );
    return JSON.parse(json);
  } catch {
    return {};
  }
}

function userFromJwt(token: string): AuthUser | null {
  const payload = decodeJwtPayload(token);
  const sub = payload.sub ?? payload.id ?? payload.userId;
  const email = String(payload.email ?? payload.username ?? "");
  const fullName = payload.fullName ?? payload.name ?? payload.full_name ?? email.split("@")[0];
  const role = payload.role;

  if (!sub) return null;

  return {
    id: String(sub),
    email: String(email),
    fullName: String(fullName),
    role: typeof role === "string" ? role : undefined,
    phone: typeof payload.phone === "string" ? payload.phone : undefined,
  };
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await api.post<Record<string, unknown>>("/auth/login", data);
  const token = extractToken(res);

  if (!token) {
    console.error("No token in login response:", res);
    throw new Error("Phản hồi từ server không chứa token.");
  }

  const user = extractUser(res) ?? userFromJwt(token);

  if (!user) {
    console.error("Cannot extract user from login response:", res);
    throw new Error("Không thể đọc thông tin người dùng từ phản hồi server.");
  }

  return { accessToken: token, user };
}

export async function register(data: RegisterRequest): Promise<AuthUser> {
  const res = await api.post<Record<string, unknown>>("/auth/register", data);

  let user = extractUser(res);
  if (!user && res.id) {
    user = {
      id: String(res.id),
      email: String(res.email),
      fullName: String(res.fullName),
      role: typeof res.role !== "undefined" ? String(res.role) : undefined,
      phone: typeof res.phone === "string" ? res.phone : undefined,
    };
  }

  if (!user) {
    console.error("Cannot extract user from register response:", res);
    throw new Error("Không thể đọc thông tin người dùng từ phản hồi server.");
  }

  return user;
}