const API_BASE = "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("admin_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  const data = await res.json();
  localStorage.setItem("admin_token", data.token);
  return data;
}

export function adminLogout() {
  localStorage.removeItem("admin_token");
}

export function isAdminLoggedIn() {
  return Boolean(getToken());
}

// NEWS
export async function getNews() {
  const res = await fetch(`${API_BASE}/news`);
  return res.json();
}

export async function createNews(item) {
  const res = await fetch(`${API_BASE}/news`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error("Create news failed");
  return res.json();
}

export async function deleteNews(id) {
  const res = await fetch(`${API_BASE}/news/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!res.ok) throw new Error("Delete news failed");
}

// HORSES
export async function getHorses() {
  const res = await fetch(`${API_BASE}/horses`);
  return res.json();
}

export async function updateHorse(id, patch) {
  const res = await fetch(`${API_BASE}/horses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Update horse failed");
  return res.json();
}
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { ...authHeaders() }, // ingen Content-Type här (FormData fixar)
    body: fd,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json(); // { imageUrl }
}