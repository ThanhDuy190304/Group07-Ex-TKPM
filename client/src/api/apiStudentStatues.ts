import api from "../config/axios";
import { StudentStatus } from "../types/studentStatus";
import { extractData } from "./apiHelper";

export async function getStatuses(): Promise<StudentStatus[]> {
    try {
        const response = await api.get<{ data: StudentStatus[] }>("/student/statuses");
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi lấy các trạng thái của sinh viên:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể lấy danh sách trạng thái sinh viên. Vui lòng thử lại sau.",
        };
    }
}

export async function postStatus(newStatus: Partial<StudentStatus>): Promise<StudentStatus> {
    try {
        const response = await api.post<{ data: StudentStatus }>("/student/statuses", newStatus);
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi tạo trạng thái:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể tạo trạng thái sinh viên. Vui lòng thử lại sau.",
        };
    }
}

export async function putStatus(statusId: string, updatedData: Partial<StudentStatus>): Promise<StudentStatus> {
    try {
        const response = await api.put<{ data: StudentStatus }>(`/student/statuses/${statusId}`, updatedData);
        return extractData(response).data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Không thể cập nhật trạng thái sinh viên. Vui lòng thử lại sau.",
        };
    }
}