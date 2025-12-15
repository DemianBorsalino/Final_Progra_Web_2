//frontend/src/services/authServices.js
const API_URL = "http://localhost:3000/api"; // tu backend

// LOGIN
export async function login(email, clave) {
    const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, clave })
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.msg || "Error al iniciar sesión");
    }

    const data = await res.json();

    // Guardamos token y usuario
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return data;
}

// LOGOUT
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}

// OBTENER USER
export function getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

// VERIFICAR LOGIN
export function isLogged() {
    return !!localStorage.getItem("token");
}

// VERIFICAR ADMIN
export function isAdmin() {
    const user = getUser();
    return user?.rol === "admin";
}

// OBTENER TOKEN
export function getToken() {
    return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}
