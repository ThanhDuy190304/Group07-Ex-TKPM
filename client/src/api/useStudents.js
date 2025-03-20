import api from "../utils/axios";

export const getStudents = async ({ searchQuery = {}, page = 1, limit = 20 } = {}) => {
    try {
        const params = {
            page,
            limit,
            studentId: searchQuery.studentId || undefined,
            fullName: searchQuery.fullName || undefined,
            facultyId: searchQuery.facultyId || undefined,
            courseId: searchQuery.courseId || undefined,
            programId: searchQuery.programId || undefined,
        };
        // Xóa các giá trị undefined
        Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
        const queryString = new URLSearchParams(params).toString();
        const url = `/student?${queryString}`;
        const response = await api.get(url);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi fetch students:", error);
        return { students: [], total: 0, error: error.response?.data?.message || "Lỗi server" };
    }
};


export const putStudent = async (studentId, updatedData) => {
    try {
        const response = await api.put(`/student/${studentId}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật sinh viên:", error);
        return { error: error.response?.data?.message || "Lỗi server" };
    }
};

export const deleteStudent = async (studentId) => {
    try {
        await api.delete(`/student/${studentId}`);
        return true;
    } catch (error) {
        console.error("Lỗi khi xóa sinh viên:", error);
        return { error: error.response?.data?.message || "Lỗi server" };
    }
};

export const postStudent = async (studentData) => {
    try {
        const response = await api.post("/student", studentData);
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 400) {
            // In ra toàn bộ dữ liệu lỗi để kiểm tra cấu trúc phản hồi từ server
            console.log("Error response data:", error.response.data);
            return { error: error.response.data.error || "Lỗi không xác định" };
        }
        return { error: "Lỗi server" };
    }
};

export const getStatuses = async () => {
    try {
        const response = await api.get("/student/statuses");
        return response.data;
    } catch (error) {
        console.error("Lỗi khi fetch student statuses:", error);
        return { error: error.response?.data?.message || "Lỗi server" };
    }
}

export const putStatus = async (statusId, updatedData) => {
    try {
        const response = await api.put(`/student/statuses/${statusId}`, updatedData)
        return response.data;
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái: ", error);
        return { error: error.response?.data?.message || "Lỗi server" };
    }
}

export const postStatus = async (newStatus) => {
    try {
        const response = await api.post("/student/statuses", newStatus);
        console.log("res: ", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo trạng thái: ", error);
        return { error: "Lỗi server" };
    }
}

