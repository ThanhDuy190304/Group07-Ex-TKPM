import api from "../utils/axios";

export const getCourses = async () => {
    try {
        const { data } = await api.get("/course");
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch courses:", error);
        throw new Error("Không thể lấy dữ liệu khóa học. Vui lòng thử lại sau.");
    }
};
