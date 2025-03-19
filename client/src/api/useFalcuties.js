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

export const postFaculty = async (newFaculty) => {
    try {
        const { data } = await api.post("/faculty", newFaculty);
        return data;
    } catch (error) {
        console.error("Lỗi khi tạo khoa:", error);
        throw new Error("Không thể tạo khoa. Vui lòng thử lại sau.");
    }
};

export const putFaculty = async (facultyId, updatedData) => {
    try {
        const { data } = await api.put(`/faculty/${facultyId}`, updatedData);
        return data;
    } catch (error) {
        console.error("Lỗi khi cập nhật khoa:", error);
        throw new Error("Không thể cập nhật khoa. Vui lòng thử lại sau.");
    }
};