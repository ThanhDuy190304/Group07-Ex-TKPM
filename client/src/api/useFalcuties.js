import api from "../utils/axios";

export const getFaculties = async () => {
    try {
        const { data } = await api.get("/faculty");
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch faculties:", error);
        throw new Error("Không thể lấy dữ liệu khoa. Vui lòng thử lại sau.");
    }
};