import api from "../config/axios";
import { Student, PaginatedStudents } from "../types/student"
import { StudentStatus } from "../types/studentStatus"
// export const importStudents = async (file) => {
//     try {
//         const formData = new FormData();
//         formData.append("file", file);
//         const response = await api.post("/student/import", formData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//         });
//         return response.data;
//     } catch (error : any) {
//         console.error("Lỗi khi import sinh viên:", error);
//         return { error: error.response?.data?.message || "Lỗi server" };
//     }
// };


export async function getPaginatedStudents({
    searchQuery = {},
    page = 1,
    limit = 20,
}: {
    searchQuery: Partial<Student>;
    page?: number;
    limit?: number;
}): Promise<PaginatedStudents> {
    try {
        const url = "/student";
        const params = { page, limit, searchQuery };
        const response = await api.get<PaginatedStudents>(url, { params });
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi fetch students: ", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}

export async function putStudent(studentId: string, updatedData: Partial<Student>): Promise<Student> {
    try {
        const response = await api.put<Student>(`/student/${studentId}`, updatedData);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật sinh viên: ", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}

export async function deleteStudent(studentId: string): Promise<void> {
    try {
        await api.delete(`/student/${studentId}`);
    } catch (error: any) {
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}

export async function postStudent(studentData: Omit<Student, "studentId">): Promise<Student> {
    try {
        const response = await api.post<Student>("/student", studentData);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi tạo sinh viên: ", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}

export async function getAllStudents(searchQuery: Partial<Student> = {}): Promise<Student[]> {
    try {
        const params: Partial<Student> = { ...searchQuery };

        const response = await api.get<Student[]>("/student/export", { params });
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi xuất toàn bộ dữ liệu sinh viên:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}

export async function getStatuses(): Promise<StudentStatus[]> {
    try {
        const response = await api.get<StudentStatus[]>("/student/statuses");
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi lấy các trạng thái của sinh viên:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}

export async function putStatus(id: string, updatedData: Partial<StudentStatus>): Promise<StudentStatus> {
    try {
        const response = await api.put<StudentStatus>(`/student/statuses/${id}`, updatedData);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}

export async function postStatus(newStatus: StudentStatus): Promise<StudentStatus> {
    try {
        const response = await api.post<StudentStatus>("/student/statuses", newStatus);
        return response.data;
    } catch (error: any) {
        console.error("Lỗi khi tạo trạng thái:", error);
        throw {
            status: error.response?.status || 503,
            message: error.response?.data?.message || "Lỗi server",
        };
    }
}