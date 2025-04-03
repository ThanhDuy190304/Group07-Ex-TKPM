import api from "../config/axios";
import { Program } from "../types/program";


export async function getPrograms() {
    try {
        const response = await api.get("/program");
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi fetch programs:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.error_vn || "Không thể lấy dữ liệu chương trình học. Vui lòng thử lại sau.",
        };
    }
}

export async function postProgram(newProgram: Partial<Program>) {
    try {
        const response = await api.post("/program", newProgram);
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi tạo chương trình học:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.error_vn || "Không thể tạo chương trình học. Vui lòng thử lại sau.",
        };
    }
}

export async function putProgram(programId: string, updatedData: Partial<Program>) {
    try {
        const response = await api.put(`/program/${programId}`, updatedData);
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật chương trình học:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.error_vn || "Không thể cập nhật chương trình học. Vui lòng thử lại sau.",
        };
    }
}