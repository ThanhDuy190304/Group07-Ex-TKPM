import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getClasses, postClass, postRegisterClass, cancelRegisterClass, getDetailByClassCode,
    putClassRegistrationPeriod, getClassRegistrationPeriods, postClassRegistrationPeriod
} from "../api/apiClasses"
import { Class } from "../types/class"
import { ClassRegistration } from "../types/classRegistration";
import { ClassRegistrationPeriod } from "../types/classRegistrationPeriod";

export function useClasses() {
    const queryClient = useQueryClient();

    const classesQuery = useQuery({
        queryKey: ["classes"],
        queryFn: getClasses,
        refetchOnWindowFocus: false,
    });

    const createClassQuery = useMutation({
        mutationFn: (newClass: Partial<Class>) => postClass(newClass),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["classes"],
            });
        }
    })

    return {
        classesQuery, createClassQuery
    }
}


export function useRegisterClass(classCode: string) {
    const queryClient = useQueryClient();

    // 1. Lấy chi tiết danh sách đăng ký lớp
    const classRegistrationQuery = useQuery({
        queryKey: ["classRegistrations", classCode],
        queryFn: () => getDetailByClassCode({ classCode: classCode }),
        enabled: !!classCode,
        refetchOnWindowFocus: false,
    });

    // 2. Đăng ký lớp học
    const registerClassMutation = useMutation({
        mutationFn: postRegisterClass,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["classRegistrations", classCode],
            });
        }
    });

    // 3. Hủy đăng ký lớp học
    const cancelRegisterClassMutation = useMutation({
        mutationFn: cancelRegisterClass,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["classRegistrations", classCode],
            });
        }
    });

    return {
        classRegistrationQuery,
        registerClassMutation,
        cancelRegisterClassMutation,
    };
}

export function useClassRegistrationPeriods() {
    const queryClient = useQueryClient();

    // 1. Lấy danh sách thời gian đăng ký lớp học
    const classRegistrationPeriodsQuery = useQuery({
        queryKey: ["classRegistrationPeriods"],
        queryFn: getClassRegistrationPeriods,
        refetchOnWindowFocus: false,
    });

    // 2. Tạo thời gian đăng ký lớp học
    const createClassRegistrationPeriodMutation = useMutation({
        mutationFn: postClassRegistrationPeriod,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["classRegistrationPeriods"],
            });
        }
    });

    // 3. Cập nhật thời gian đăng ký lớp học
    const updateClassRegistrationPeriodMutation = useMutation({
        mutationFn: ({ id, updatedData }: { id: string; updatedData: Partial<ClassRegistrationPeriod> }) =>
            putClassRegistrationPeriod(id, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["classRegistrationPeriods"],
            });
        }
    });


    return {
        classRegistrationPeriodsQuery,
        createClassRegistrationPeriodMutation,
        updateClassRegistrationPeriodMutation
    }
}