import api from "../config/axios";
import { Program } from "../types/program";
import { getErrorMessage } from "../utils/errorMessage";

export async function getPrograms() {
    try {
        const response = await api.get("/programs");
        return response.data?.data;
    } catch (error: any) {
        throw {
            status: error.response?.status || 503,
            message: getErrorMessage(error),
        };
    }
}

export async function postProgram(newProgram: Partial<Program>) {
    try {
        const response = await api.post("/programs", newProgram);
        return response.data?.data;
    } catch (error: any) {
        throw {
            status: error.response?.status || 503,
            message: getErrorMessage(error),
        };
    }
}

export async function putProgram(programId: string, updatedData: Partial<Program>) {
    try {
        const response = await api.put(`/programs/${programId}`, updatedData);
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật chương trình học:", error);
        throw {
            status: error.response?.status || 503,
            message: getErrorMessage(error)
        };
    }
}