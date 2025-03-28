import api from "../config/axios";
import { Course } from "../types/course";
import { extractData } from "./apiHelper";

export async function getCourses(): Promise<Course[]> {
    try {
        const response = await api.get<{ data: Course[] }>("/course");
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi lấy danh sách khóa học: ", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể lấy dữ liệu khóa học. Vui lòng thử lại sau.",
        };
    }
}
