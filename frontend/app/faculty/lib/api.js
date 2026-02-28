const BASE_URL = "http://localhost:3000";

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("facultyToken");

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

export const facultyApi = {
    // Authentication
    login: (credentials) => apiFetch("/api/faculty/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    }),
    logout: () => apiFetch("/api/faculty/logout", { method: "POST" }),

    // Profile
    getProfile: () => apiFetch("/faculty/profile"),

    // Student Management
    getAllStudents: () => apiFetch("/faculty/students"),
    updateStudentMarks: (login_id, data) => apiFetch(`/faculty/students/${login_id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    }),

    // Placements
    getAllPlacements: () => apiFetch("/faculty/students/placement"),

    // Analytics
    getStudentList: (filters = {}) => {
        const params = new URLSearchParams(filters);
        const query = params.toString() ? `?${params.toString()}` : "";
        return apiFetch(`/faculty/analytics/students${query}`);
    },
    getWeakStudents: () => apiFetch("/faculty/analytics/weak"),
    getTopStudents: () => apiFetch("/faculty/analytics/top"),
    getDashboardStats: () => apiFetch("/faculty/analytics/stats"),
    getFacultyPlacementRatio: () => apiFetch("/faculty/analytics/department-students"),
};
