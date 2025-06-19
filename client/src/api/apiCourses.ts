import api from "../config/axios";
import { Course } from "../types/course";
import { getErrorMessage } from "../utils/errorMessage";

export async function getCourses() {
    try {
        const response = await api.get("/courses");
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
        const response = await api.post("/courses", newFaculty);
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
        await api.delete(`/courses/${courseId}`);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}

export async function putCourse({ courseId, updatedCourse }: { courseId: string, updatedCourse: Partial<Course> }) {
    try {
        await api.put(`/courses/${courseId}`, updatedCourse);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error),
        };
    }
}
