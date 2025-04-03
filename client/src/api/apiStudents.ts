import api from "../config/axios";
import { Student } from "../types/student"
import { GetAllBaseResponse } from "../types/BaseResponse"
import { extractData } from "./apiHelper";

export const importStudents = async (file: any) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post("/student/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi import sinh viên:", error);
        return { error: error.response?.data?.message || "Lỗi server" };
    }
};

export async function putStudent(studentId: string, updatedData: Partial<Student>): Promise<Student> {
    try {
        const response = await api.put<{ data: Student }>(`/student/${studentId}`, updatedData);
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật sinh viên: ", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}

export async function deleteStudent(studentId: string): Promise<void> {
    try {
        await api.delete(`/student/${studentId}`);
    } catch (error: any) {
        console.error("Lỗi khi xóa sinh viên: ", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}

export async function postStudent(studentData: Partial<Student>): Promise<Student> {
    try {
        const response = await api.post<{ data: Student }>("/student", studentData);
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi tạo sinh viên: ", error);
        throw {
            message: error.response?.data?.error_vn || "Lỗi server",
        };
    }
}

export async function getAllStudents(searchQuery: Partial<Student> & { page?: number; limit?: number } = {}): Promise<GetAllBaseResponse<Student>> {
    try {
        const response = await api.get<{ data: GetAllBaseResponse<Student> }>("/student", {
            params: searchQuery,
        });
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi xuất mảng sinh viên:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}