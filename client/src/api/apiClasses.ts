import api from "../config/axios";
import { Class } from "../types/class";
import { ClassRegistrationPeriod } from "../types/classRegistrationPeriod";
import { getErrorMessage } from "../utils/errorMessage";


export async function getClasses() {
    try {
        const response = await api.get("/classes");
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
        await api.post("/classes", newClass);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error)
        };
    }
}
export async function postRegisterClass({ studentCode, classCode }: { studentCode: string; classCode: string }) {
    try {
        await api.post(`/classes/allocate/${classCode}/${studentCode}`);
    } catch (error: any) {
        throw {
            status: error.response?.status,
            message: getErrorMessage(error)
        };
    }
}

export async function cancelRegisterClass({ studentId, classId }: { studentId: string; classId: string }) {
    try {
        await api.post(`/classes/cancel/${classId}/${studentId}`);
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
        const response = await api.get(`/classes/class-registrations/${classCode}`);
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
        const response = await api.get("/classes/class-registration-periods");
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
        await api.post("/classes/class-registration-periods", newPeriod);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error)
        };
    }
}

export async function putClassRegistrationPeriod(id: string, updatedPeriod: Partial<ClassRegistrationPeriod>) {
    try {
        await api.put(`/classes/class-registration-periods/${id}`, updatedPeriod);
    } catch (error: any) {
        throw {
            status: error.response.status,
            message: getErrorMessage(error)
        };
    }
}