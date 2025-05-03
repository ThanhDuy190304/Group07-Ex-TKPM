import api from "../config/axios";
import { Course } from "../types/course";

export async function getCourses() {
    try {
        const response = await api.get("/course");
        return response.data?.data;
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: error.response.data.error_vn,
        };
    }
}

export async function postCourses(newFaculty: Partial<Course>) {
    try {
        const response = await api.post("/course", newFaculty);
        return response.data.data;
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: error.response.data.error_vn,
        };
    }
}

export async function deleteCourse(courseId: string) {
    try {
        await api.delete(`/student/${courseId}`);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: error.response.data.error_vn,
        };
    }
}
