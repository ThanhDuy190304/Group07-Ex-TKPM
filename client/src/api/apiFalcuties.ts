import api from "../config/axios";
import { Faculty } from "../types/faculty";
import { extractData } from "./apiHelper";

export async function getFaculties(): Promise<Faculty[]> {
    try {
        const response = await api.get<{ data: Faculty[] }>("/faculty");
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi fetch faculties:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể lấy dữ liệu khoa. Vui lòng thử lại sau.",
        };
    }
}

export async function postFaculty(newFaculty: Partial<Faculty>): Promise<Faculty> {
    try {
        const response = await api.post<{ data: Faculty }>("/faculty", newFaculty);
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi tạo khoa:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể tạo khoa. Vui lòng thử lại sau.",
        };
    }
}

export async function putFaculty(facultyId: string, updatedData: Partial<Faculty>): Promise<Faculty> {
    try {
        const { data } = await api.put<Faculty>(`/faculty/${facultyId}`, updatedData);
        return data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật khoa:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể cập nhật khoa. Vui lòng thử lại sau.",
        };
    }
}
