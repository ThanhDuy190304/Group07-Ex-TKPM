import api from "../config/axios";
import { Faculty } from "../types/faculty";


export async function getFaculties() {
    try {
        const response = await api.get("/faculty");
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi fetch faculties:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.error_vn || "Không thể lấy dữ liệu khoa. Vui lòng thử lại sau.",
        };
    }
}

export async function postFaculty(newFaculty: Partial<Faculty>) {
    try {
        const response = await api.post("/faculty", newFaculty);
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi tạo khoa:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.error_vn || "Không thể tạo khoa. Vui lòng thử lại sau.",
        };
    }
}

export async function putFaculty(facultyId: string, updateData: Partial<Faculty>) {
    try {
        const response = await api.put(`/faculty/${facultyId}`, updateData);
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật khoa:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.error_vn || "Không thể cập nhật khoa. Vui lòng thử lại sau.",
        };
    }
}
