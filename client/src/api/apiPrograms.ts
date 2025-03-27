import api from "../config/axios";
import { Program } from "../types/program";
import { extractData } from "./apiHelper";

export async function getPrograms(): Promise<Program[]> {
    try {
        const response = await api.get<{ data: Program[] }>("/program");
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi fetch programs:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể lấy dữ liệu chương trình học. Vui lòng thử lại sau.",
        };
    }
}

export async function postProgram(newProgram: Partial<Program>): Promise<Program> {
    try {
        const response = await api.post<{ data: Program }>("/program", newProgram);
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi tạo chương trình học:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể tạo chương trình học. Vui lòng thử lại sau.",
        };
    }
}

export async function putProgram(programId: string, updatedData: Partial<Program>): Promise<Program> {
    try {
        const { data } = await api.put<Program>(`/program/${programId}`, updatedData);
        return data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật chương trình học:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể cập nhật chương trình học. Vui lòng thử lại sau.",
        };
    }
}