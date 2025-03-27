import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getStatuses, postStatus, putStatus } from "../api/apiStudentStatues";
import { StudentStatus } from "../types/studentStatus";

export function useStudentStatus() {
    const queryClient = useQueryClient();

    const studentStatusesQuery = useQuery<StudentStatus[]>({
        queryKey: ["studentStatuses"],
        queryFn: getStatuses,
    });

    const createStudentStatus = useMutation({
        mutationFn: (newStatus: Partial<StudentStatus>) => postStatus(newStatus),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["studentStatuses"],
            });
        },
    });

    const updateStudentStatus = useMutation({
        mutationFn: ({ statusId, updatedData }: { statusId: string; updatedData: Partial<StudentStatus> }) =>
            putStatus(statusId, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["studentStatuses"],
            });
        },
    });

    return {
        studentStatusesQuery,
        createStudentStatus,
        updateStudentStatus,
    };
}