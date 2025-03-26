import api from "../config/axios";
import { Program } from "../types/program"

export async function getPrograms(): Promise<Program[]> {
    try {
        const { data } = await api.get<Program[]>("/program");
        return data;
    } catch (error: any) {
        console.error("Lỗi khi fetch programs:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể lấy dữ liệu chương trình đào tạo. Vui lòng thử lại sau.",
        };
    }
}

export async function postProgram(newProgram: Program): Promise<Program> {
    try {
        const { data } = await api.post<Program>("/program", newProgram);
        return data;
    } catch (error: any) {
        console.error("Lỗi khi tạo chương trình đào tạo:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể tạo chương trình đào tạo. Vui lòng thử lại sau.",
        };
    }
}

export async function putProgram(programId: string, updatedData: Partial<Program>): Promise<Program> {
    try {
        const { data } = await api.put<Program>(`/program/${programId}`, updatedData);
        return data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật chương trình đào tạo:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể cập nhật chương trình đào tạo. Vui lòng thử lại sau.",
        };
    }
}