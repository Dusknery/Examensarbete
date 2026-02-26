const API_BASE = "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("admin_token");
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function safeJson(res) {
  const text = await res.text().catch(() => "");
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

async function assertOk(res, fallbackMsg) {
  if (res.ok) return;
  const body = await safeJson(res);
  const msg =
    (body && (body.error || body.message)) ||
    (typeof body === "string" && body) ||
    fallbackMsg ||
    `Request failed: ${res.status}`;
  throw new Error(msg);
}

/* AUTH*/
export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  await assertOk(res, "Login failed");
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

/* NEWS*/
export async function getNews() {
  const res = await fetch(`${API_BASE}/news`);
  await assertOk(res, "Could not fetch news");
  return res.json();
}

export async function createNews(item) {
  const res = await fetch(`${API_BASE}/news`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(item),
  });
  await assertOk(res, "Create news failed");
  return res.json();
}

export async function deleteNews(id) {
  const res = await fetch(`${API_BASE}/news/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  await assertOk(res, "Delete news failed");
}

/* HORSES */
export async function getHorses() {
  const res = await fetch(`${API_BASE}/horses`);
  await assertOk(res, "Could not fetch horses");
  return res.json();
}

export async function getHorseById(id) {
  const res = await fetch(`${API_BASE}/horses/${id}`);
  await assertOk(res, "Could not fetch horse");
  return res.json();
}

export async function getStudHorses() {
  const horses = await getHorses();
  return horses.filter((h) => h.isStud);
}

export async function createHorse(horse) {
  const res = await fetch(`${API_BASE}/horses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(horse),
  });
  await assertOk(res, "Create horse failed");
  return res.json();
}


export async function updateHorse(id, patch) {
  const res = await fetch(`${API_BASE}/horses/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(patch),
  });
  await assertOk(res, "Update horse failed");
  return res.json();
}

export async function deleteHorse(id) {
  const res = await fetch(`${API_BASE}/horses/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  await assertOk(res, "Delete horse failed");
  return res.json(); 
}

export async function generateHorseIds() {
  const res = await fetch(`${API_BASE}/horses/generate-ids`, {
    method: "POST",
    headers: { ...authHeaders() },
  });
  await assertOk(res, "Generate ids failed");
  return res.json(); 
}

/*UPLOAD*/
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("image", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { ...authHeaders() },
    body: fd,
  });

  await assertOk(res, "Upload failed");
  return res.json(); 
}
