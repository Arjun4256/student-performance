const BASE_URL = "http://localhost:3000";

const apiFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem("adminToken");

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

export const adminApi = {
    login: (credentials) => apiFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify(credentials)
    }),
    logout: () => apiFetch("/api/admin/logout", { method: "POST" }),

    // Student Management
    getAllStudents: (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiFetch(`/api/admin/students?${queryParams}`);
    },
    getStudentById: (id) => apiFetch(`/api/admin/students/${id}`),
    verifyStudent: (id) => apiFetch(`/api/admin/students/verify/${id}`, { method: "PUT" }),
    updateStudentStatus: (id, status) => apiFetch(`/api/admin/students/status/${id}`, {
        method: "PUT",
        body: JSON.stringify({ is_active: status })
    }),
    createStudentAcademic: (id, data) => apiFetch(`/api/admin/students/academic/${id}`, {
        method: "POST",
        body: JSON.stringify(data)
    }),
    updateStudentAcademic: (id, data) => apiFetch(`/api/admin/students/academic/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    }),
    deleteStudent: (id) => apiFetch(`/api/admin/students/${id}`, { method: "DELETE" }),

    // Faculty Management
    getAllFaculty: () => apiFetch("/api/admin/faculty"),
    createFaculty: (data) => apiFetch("/api/admin/faculty", {
        method: "POST",
        body: JSON.stringify(data)
    }),
    deleteFaculty: (id) => apiFetch(`/api/admin/faculty/${id}`, { method: "DELETE" }),

    // Placement Management
    getAllPlacements: (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiFetch(`/api/admin/placement?${queryParams}`);
    },
    createPlacement: (data) => apiFetch("/api/admin/placement", {
        method: "POST",
        body: JSON.stringify(data)
    }),
    updatePlacement: (id, data) => apiFetch(`/api/admin/placement/${id}`, {
        method: "PUT",
        body: JSON.stringify(data)
    }),
    deletePlacement: (id) => apiFetch(`/api/admin/placement/${id}`, { method: "DELETE" }),
    getPlacedStudents: (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiFetch(`/api/admin/placement/placed?${queryParams}`);
    },
    getUnplacedStudents: (filters = {}) => {
        const queryParams = new URLSearchParams(filters).toString();
        return apiFetch(`/api/admin/placement/unplaced?${queryParams}`);
    },

    // Report Management
    downloadEligibleList: async (cutoff = 7.0) => {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${BASE_URL}/reports/eligible-list?cutoff=${cutoff}`, {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        if (!response.ok) throw new Error("Failed to download eligible list");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `eligible_students_${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    },
    downloadPerformanceSummary: async () => {
        const token = localStorage.getItem("adminToken");
        const response = await fetch(`${BASE_URL}/reports/performance-summary`, {
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
        });
        if (!response.ok) throw new Error("Failed to download performance summary");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `performance_summary_${new Date().getTime()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    },

    // Dashboard & Stats
    getOverviewStats: () => apiFetch("/api/admin/dashboard/stats"),
    updateFacultyStatus: (login_id, is_active) => apiFetch("/api/admin/dashboard/faculty/status/" + login_id, {
        method: "PUT",
        body: JSON.stringify({ is_active })
    }),
    getPlacementsByCompany: () => apiFetch("/analytics/placements/company"),
    getPlacementStatusStats: () => apiFetch("/analytics/placements/status"),
    getAveragePackage: () => apiFetch("/analytics/placements/average-package"),
    getTopCompaniesByPackage: () => apiFetch("/analytics/placements/top-companies"),
    getDepartmentWiseCGPA: () => apiFetch("/analytics/academics/department-cgpa"),
    getCGPADistribution: () => apiFetch("/analytics/academics/cgpa-distribution"),
    getPlacementEligibility: (cutoff = 7.0) => apiFetch(`/analytics/analytics/eligibility?cutoff=${cutoff}`),
    getPlacementReadiness: () => apiFetch("/analytics/analytics/readiness"),
};
