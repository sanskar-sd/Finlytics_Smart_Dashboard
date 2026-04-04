import api from "./api";

export async function registerAdmin(payload) {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
}

export async function login(payload) {
  const res = await api.post("/api/auth/login", payload);
  return res.data;
}
