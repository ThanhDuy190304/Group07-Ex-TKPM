import api from "../config/axios";
import { Course } from "../types/course";
import { getErrorMessage } from "../utils/errorMessage";

export async function getCourses() {
    try {
        const response = await api.get("/course");
        return response.data?.data;
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
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
            message: getErrorMessage(error),
        };
    }
}

export async function deleteCourse(courseId: string) {
    try {
        await api.delete(`/course/${courseId}`);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}

export async function putCourse({ courseId, updatedCourse }: { courseId: string, updatedCourse: Partial<Course> }) {
    try {
        await api.put(`/course/${courseId}`, updatedCourse);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}
