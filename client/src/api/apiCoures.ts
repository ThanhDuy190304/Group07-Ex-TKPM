import api from "../config/axios";
import { Course } from "../types/course"

export async function getCourses(): Promise<Course[]> {
    try {
        const { data } = await api.get<Course[]>("/course");
        return data;
    } catch (error: any) {
        console.error("Lỗi khi lấy danh sách khóa sinh viên: ", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể lấy dữ liệu khóa sinh viên. Vui lòng thử lại sau",
        };
    }
}

