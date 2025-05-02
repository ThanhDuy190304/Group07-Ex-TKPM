import api from "../config/axios";
import { Student } from "../types/student"

export const importStudents = async (file: any) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post("/student/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi import sinh viên:", error);
        return { error: error.response.data.message };
    }
};

export async function putStudent(studentId: string, updatedData: Partial<Student>) {
    try {
        const response = await api.put(`/student/${studentId}`, updatedData);
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật sinh viên: ", error);
        throw {
            status: error.response.status,
            message: error.response.data.error_vn,
        };
    }
}

export async function deleteStudent(studentId: string) {
    try {
        await api.delete(`/student/${studentId}`);
    } catch (error: any) {
        console.error("Lỗi khi xóa sinh viên: ", error);
        throw {
            status: error.response.status,
            message: error.response.data.error_vn,
        };
    }
}

export async function postStudent(studentData: Partial<Student>) {
    try {
        const response = await api.post("/student", studentData);
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi tạo sinh viên: ", error);
        throw {
            status: error.response.status,
            message: error.response.data.error_vn,
        };
    }
}

export async function getAllStudents(searchQuery: Partial<Student> & { page?: number; limit?: number } = {}) {
    try {
        const response = await api.get("/student", {
            params: searchQuery,
        });
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi xuất mảng sinh viên:", error);
        throw {
            status: error.response.status,
            message: error.response.data.error_vn,
        };
    }
}