const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

const TOKEN_KEY = "jiseti_token";
const USER_KEY = "jiseti_auth_user";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const ROLE_TO_API = { admin: "official", citizen: "citizen" };
const ROLE_FROM_API = { official: "admin", citizen: "citizen" };

const CATEGORY_TO_API = { "Red-flag": "red-flag", Intervention: "intervention" };
const CATEGORY_FROM_API = { "red-flag": "Red-flag", intervention: "Intervention" };

const STATUS_TO_API = {
  Pending: "pending",
  "In Progress": "in-progress",
  Resolved: "resolved",
};
const STATUS_FROM_API = {
  pending: "Pending",
  "in-progress": "In Progress",
  resolved: "Resolved",
};

function mapReportFromApi(r) {
  return {
    id: String(r.id),
    type: CATEGORY_FROM_API[r.category] || r.category,
    title: r.title,
    description: r.description,
    location: { label: r.location || "Unspecified Location" },
    status: STATUS_FROM_API[r.status] || r.status,
    upvotes: r.upvotes || 0,
    imageUrl: r.photo_url ? `${API_BASE}${r.photo_url}` : null,
    createdAt: r.created_at,
    userId: r.user_id,
  };
}

async function request(path, { method = "GET", body, isForm = false, auth = false } = {}) {
  const headers = {};
  if (!isForm) headers["Content-Type"] = "application/json";
  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: isForm ? body : body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.error || data?.msg || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export async function apiSignup({ name, email, password, role }) {
  const data = await request("/auth/signup", {
    method: "POST",
    body: {
      full_name: name,
      email,
      password,
      role: ROLE_TO_API[role] || "citizen",
    },
  });
  const user = {
    id: data.user.id,
    name: data.user.full_name,
    email,
    role: ROLE_FROM_API[data.user.role] || "citizen",
  };
  setSession(data.token, user);
  return user;
}

export async function apiLogin({ email, password }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  const user = {
    id: data.user.id,
    name: data.user.full_name,
    email,
    role: ROLE_FROM_API[data.user.role] || "citizen",
  };
  setSession(data.token, user);
  return user;
}

export async function apiGetReports(statusFilter) {
  const query =
    statusFilter && statusFilter !== "All"
      ? `?status=${encodeURIComponent(STATUS_TO_API[statusFilter] || statusFilter)}`
      : "";
  const data = await request(`/reports${query}`);
  return data.map(mapReportFromApi);
}

export async function apiGetReportById(id) {
  const data = await request(`/reports/${id}`);
  return mapReportFromApi(data);
}

export async function apiCreateReport({
  type,
  title,
  description,
  locationLabel,
  photoFile,
}) {
  const form = new FormData();
  form.append("category", CATEGORY_TO_API[type] || "red-flag");
  form.append("title", title);
  form.append("description", description || "");
  form.append("location", locationLabel || "");
  if (photoFile) form.append("photo", photoFile);

  const data = await request("/reports", {
    method: "POST",
    body: form,
    isForm: true,
    auth: true,
  });
  return mapReportFromApi(data);
}

export async function apiUpdateReportDetails(id, { title, description, locationLabel }) {
  const data = await request(`/reports/${id}`, {
    method: "PATCH",
    body: { title, description, location: locationLabel },
    auth: true,
  });
  return mapReportFromApi(data);
}

export async function apiDeleteReport(id) {
  await request(`/reports/${id}`, { method: "DELETE", auth: true });
}

export async function apiUpvoteReport(id) {
  await request(`/reports/${id}/upvote`, { method: "POST", auth: true });
}

export async function apiUpdateReportStatus(id, status) {
  const data = await request(`/admin/reports/${id}/status`, {
    method: "PATCH",
    body: { status: STATUS_TO_API[status] || status },
    auth: true,
  });
  return mapReportFromApi(data);
}

export async function apiGetAlerts() {
  const data = await request("/alerts");
  return data.map((a) => ({
    id: a.id,
    title: a.title,
    body: a.message,
    time: new Date(a.created_at).toLocaleString(),
  }));
}

export async function apiCreateAlert({ title, message }) {
  const data = await request("/alerts", {
    method: "POST",
    body: { title, message },
    auth: true,
  });
  return {
    id: data.id,
    title: data.title,
    body: data.message,
    time: new Date(data.created_at).toLocaleString(),
  };
}
