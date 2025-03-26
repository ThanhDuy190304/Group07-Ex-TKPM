import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStatuses, postStatus, putStatus } from "../api/apiStudents";
import { StudentStatus } from "../types/studentStatus";

export function useStudentStatus() {
    const queryClient = useQueryClient();

    const studentStatusesQuery = useQuery<StudentStatus[]>({
        queryKey: ["studentStatuses"],
        queryFn: getStatuses,
    });

    const createStudentStatus = useMutation({
        mutationFn: (newStatus: StudentStatus) => postStatus(newStatus),
        onSuccess: (createdStatus: StudentStatus) => {
            queryClient.setQueryData<StudentStatus[]>(["studentStatuses"], (oldStatuses) => {
                if (!oldStatuses) return [createdStatus];
                return [...oldStatuses, createdStatus];
            });
        },
    });

    const updateStudentStatus = useMutation({
        mutationFn: ({ statusId, updatedData }: { statusId: string; updatedData: Partial<StudentStatus> }) =>
            putStatus(statusId, updatedData),
        onSuccess: (updatedStatus: StudentStatus) => {
            queryClient.setQueryData<StudentStatus[]>(["studentStatuses"], (oldStatuses) => {
                if (!oldStatuses) return [];
                return oldStatuses.map((status) =>
                    status.statusId === updatedStatus.statusId ? updatedStatus : status
                );
            });
        },
    });

    return {
        studentStatusesQuery,
        createStudentStatus,
        updateStudentStatus,
    };

}
