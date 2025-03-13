import api from "../utils/axios";

export const getPrograms = async () => {
    try {
        const { data } = await api.get("/program");
        return data;
    } catch (error) {
        console.error("Lỗi khi fetch programs:", error);
        throw new Error("Không thể lấy dữ liệu chương trình đào tạo. Vui lòng thử lại sau.");
    }
};
