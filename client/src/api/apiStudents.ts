import api from "../config/axios";
import { Student } from "../types/student"
import { getErrorMessage } from "../utils/errorMessage";

export const importStudents = async (file: any) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await api.post("/students/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data?.data;
    } catch (error: any) {
        return { error: getErrorMessage(error) };
    }
};

export async function putStudent(studentId: string, updatedData: Partial<Student>) {
    try {
        const response = await api.put(`/students/${studentId}`, updatedData);
        return response.data?.data;
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}

export async function deleteStudent(studentId: string) {
    try {
        await api.delete(`/students/${studentId}`);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}

export async function postStudent(studentData: Partial<Student>) {
    try {
        const response = await api.post("/students", studentData);
        return response.data?.data;
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}

export async function getAllStudents(searchQuery: Partial<Student> & { page?: number; limit?: number } = {}) {
    try {

        const response = await api.get("/students", {
            params: searchQuery,
        });
        return response.data?.data;
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}

export async function deleteStudents(studentIds: string[]) {
    try {
        await api.delete('/students/delete-many', {
            data: { studentIds },
        });
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}

export async function getResultByStudentCode(studentCode: string, searchQuery: { semester?: string; academicYear?: number } = {}) {
    try {
        const response = await api.get(`/students/study-results/${studentCode}`, {
            params: searchQuery,
        })
        return response.data.data;
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}