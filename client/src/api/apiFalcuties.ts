import api from "../config/axios";
import { Faculty } from "../types/faculty";

import { getErrorMessage } from "../utils/errorMessage";

export async function getFaculties() {
    try {
        const response = await api.get("/faculties");
        return response.data?.data;
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}

export async function postFaculty(newFaculty: Partial<Faculty>) {
    try {
        const response = await api.post("/faculties", newFaculty);
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi tạo khoa:", error);
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}

export async function putFaculty(facultyId: string, updateData: Partial<Faculty>) {
    try {
        const response = await api.put(`/faculties/${facultyId}`, updateData);
        return response.data?.data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật khoa:", error);
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}
