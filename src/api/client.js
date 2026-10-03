import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_GO_API_URL ||
  "http://localhost:3000";

export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Callback para notificar desautenticación (401)
let onUnauthorizedCallback = null;

export function setOnUnauthorized(cb) {
  onUnauthorizedCallback = cb;
}

// Interceptor de petición para inyectar el Bearer JWT
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("matrix_jwt");
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta para capturar expiración o rechazo de token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si la URL no era login, el token expiró o fue rechazado
      if (!error.config.url.includes("/api/auth/login")) {
        sessionStorage.removeItem("matrix_jwt");
        sessionStorage.removeItem("matrix_user");
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
      }
    }
    return Promise.reject(error);
  },
);

// Endpoints
export async function loginUser(username, password) {
  const response = await apiClient.post("/api/auth/login", {
    username,
    password,
  });
  return response.data;
}

export async function processMatrixApi(matrix) {
  const response = await apiClient.post("/api/matrix", {
    matrix,
  });
  return response.data;
}

export async function checkApiHealth() {
  const response = await apiClient.get("/health");
  return response.data;
}
