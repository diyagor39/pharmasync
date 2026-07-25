/* ============================
   PharmaSync - API Wrapper
   Central place for all backend calls.
   Change BASE_URL once backend is deployed (Render link).
   ============================ */

const BASE_URL = "https://pharmasync-backend-j9dw.onrender.com/api";// change to Render URL after deployment

async function apiRequest(endpoint, method = "GET", body = null, requiresAuth = true) {
  const headers = { "Content-Type": "application/json" };
  const user = getCurrentUser ? getCurrentUser() : null;
  if (requiresAuth && user && user.token) {
    headers["Authorization"] = `Bearer ${user.token}`;
  }

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    return data;
  } catch (err) {
    console.error(`API error [${endpoint}]:`, err.message);
    throw err;
  }
}

// Shortcuts
const api = {
  get: (endpoint) => apiRequest(endpoint, "GET"),
  post: (endpoint, body) => apiRequest(endpoint, "POST", body),
  put: (endpoint, body) => apiRequest(endpoint, "PUT", body),
  delete: (endpoint) => apiRequest(endpoint, "DELETE")
};
