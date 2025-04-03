import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFaculties, postFaculty, putFaculty } from "../api/apiFalcuties";
import { Faculty } from "../types/faculty";
import { GetAllBaseResponse } from "../types/BaseResponse"

export function useFaculties() {
    const queryClient = useQueryClient();

    const facultiesQuery = useQuery<GetAllBaseResponse<Faculty>>({
        queryKey: ["faculties"],
        queryFn: getFaculties,
    });

    const createFaculty = useMutation({
        mutationFn: (newFaculty: Partial<Faculty>) => postFaculty(newFaculty),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["faculties"],
            });
        },
    });

    const updateFaculty = useMutation({
        mutationFn: ({ facultyId, updateData }: { facultyId: string; updateData: Partial<Faculty> }) =>
            putFaculty(facultyId, updateData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["faculties"],
            });
        },
    });

    return {
        facultiesQuery,
        createFaculty,
        updateFaculty,
    };
}