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

export const postProgram = async (newProgram) => {
    try {
        const { data } = await api.post("/program", newProgram);
        return data;
    } catch (error) {
        console.error("Lỗi khi tạo chương trình đào tạo:", error);
        throw new Error("Không thể tạo chương trình đào tạo. Vui lòng thử lại sau.");
    }
}

export const putProgram = async (programId, updatedData) => {
    try {
        const { data } = await api.put(`/program/${programId}`, updatedData);
        return data;
    } catch (error) {
        console.error("Lỗi khi cập nhật chương trình đào tạo:", error);
        throw new Error("Không thể cập nhật chương trình đào tạo. Vui lòng thử lại sau.");
    }
}
