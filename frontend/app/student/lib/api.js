const BASE_URL = "http://localhost:3000";

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("studentToken");

    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        const errorMsg = data.error || data.message || "An error occurred";
        throw new Error(errorMsg);
    }

    return data;
};

export const studentApi = {
    login: (credentials) => apiFetch("/api/student/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    }),
    signup: (userData) => apiFetch("/api/student/signup", {
        method: "POST",
        body: JSON.stringify(userData)
    }),
    getProfile: () => apiFetch("/student/profile"),
    getPlacements: () => apiFetch("/student/placements"),
    getPerformance: () => apiFetch("/student/performance"),
    logout: () => apiFetch("/api/student/logout", { method: "POST" }),
};
