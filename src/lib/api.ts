const PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api/v1";

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function normalizePath(value: string): string {
  return value.startsWith("/") ? value : `/${value}`;
}

function trimTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function resolveBaseUrl(): string {
  if (PUBLIC_BASE_URL.startsWith("http://") || PUBLIC_BASE_URL.startsWith("https://")) {
    return trimTrailingSlash(PUBLIC_BASE_URL);
  }

  if (typeof window !== "undefined") {
    return PUBLIC_BASE_URL;
  }

  const backendUrl = process.env.API_BACKEND_URL ?? "http://localhost:8000";
  return `${trimTrailingSlash(backendUrl)}${normalizePath(PUBLIC_BASE_URL)}`;
}

export function getApiUrl(endpoint: string): string {
  return `${resolveBaseUrl()}${normalizePath(endpoint)}`;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getErrorMessage(value: unknown, fallback: string): string {
  if (!isRecord(value)) return fallback;

  const message = value.message ?? value.error ?? value.msg;
  if (typeof message === "string") return message;
  if (Array.isArray(message) && typeof message[0] === "string") return message[0];

  return fallback;
}

function isFormDataBody(body: unknown): body is FormData {
  return typeof FormData !== "undefined" && body instanceof FormData;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers: customHeaders, ...rest } = options;
  const isFormData = isFormDataBody(body);
  const headers = new Headers(customHeaders);

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(getApiUrl(endpoint), {
    ...rest,
    headers,
    body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  if (!res.ok) {
    const fallback = `Lỗi yêu cầu (${res.status})`;
    let message = fallback;

    try {
      message = getErrorMessage(await res.json(), fallback);
    } catch {
      message = fallback;
    }

    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json();
  }

  return res.text() as T;
}

export const api = {
  get<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "GET" });
  },
  post<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "POST", body });
  },
  put<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "PUT", body });
  },
  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "PATCH", body });
  },
  delete<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, { ...options, method: "DELETE" });
  },
};
