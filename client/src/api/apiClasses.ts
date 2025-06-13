import api from "../config/axios";
import { Class } from "../types/class";
import { ClassRegistrationPeriod } from "../types/classRegistrationPeriod";
import { getErrorMessage } from "../utils/errorMessage";


export async function getClasses() {
    try {
        const response = await api.get("/class");
        return response.data?.data;
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error)
        };
    }
}

export async function postClass(newClass: Partial<Class>) {
    try {
        await api.post("/class", newClass);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error)
        };
    }
}
export async function postRegisterClass({ studentCode, classCode }: { studentCode: string; classCode: string }) {
    try {
        await api.post(`/class/allocate/${classCode}/${studentCode}`);
    } catch (error: any) {
        throw {
            status: error.response?.status,
            message: getErrorMessage(error)
        };
    }
}

export async function cancelRegisterClass({ studentId, classId }: { studentId: string; classId: string }) {
    try {
        await api.post(`/class/cancel/${classId}/${studentId}`);
    } catch (error: any) {
        throw {
            status: error.response?.status,
            message: getErrorMessage(error)
        };
    }
}

export async function getDetailByClassCode({ classCode }: { classCode: string }) {
    try {
        console.log(classCode);
        const response = await api.get(`/class/class-registrations/${classCode}`);
        return response.data.data;
    } catch (error: any) {
        throw {
            status: error.response?.status,
            message: getErrorMessage(error)
        };
    }
}

export async function getClassRegistrationPeriods() {
    try {
        const response = await api.get("/class/class-registration-periods");
        return response.data?.data;
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error)
        };
    }
}

export async function postClassRegistrationPeriod(newPeriod: Partial<ClassRegistrationPeriod>) {
    try {
        console.log("period: ", newPeriod);
        await api.post("/class/class-registration-periods", newPeriod);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error)
        };
    }
}

export async function putClassRegistrationPeriod(id: string, updatedPeriod: Partial<ClassRegistrationPeriod>) {
    try {
        await api.put(`/class/class-registration-periods/${id}`, updatedPeriod);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error)
        };
    }
}