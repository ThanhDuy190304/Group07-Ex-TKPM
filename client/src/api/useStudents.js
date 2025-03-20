import api from "../utils/axios";

export const getStudents = async ({ searchQuery = {}, page = 1, limit = 20 } = {}) => {
    try {
        let url = `/student?page=${page}&limit=${limit}`;
        console.log(searchQuery);
        // Kiểm tra và thêm studentId hoặc fullName vào URL nếu có
        if (searchQuery.studentId) {
            console.log(1);
            url = `/student?studentId=${searchQuery.studentId}`;
        }
        else if (searchQuery.fullName) {
            console.log(2);
            url += `&fullName=${searchQuery.fullName}`;
        }
        const response = await api.get(url);
        console.log(response.data);
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

export const getStudentStatuses = async () => {
    try {
        const response = await api.get("/student/statuses");
        return response.data;
    } catch (error) {
        console.error("Lỗi khi fetch student statuses:", error);
        return { error: error.response?.data?.message || "Lỗi server" };
    }
}
