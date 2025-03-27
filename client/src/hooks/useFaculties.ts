import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFaculties, postFaculty, putFaculty } from "../api/apiFalcuties";
import { Faculty } from "../types/faculty";

export function useFaculties() {
    const queryClient = useQueryClient();

    const facultiesQuery = useQuery<Faculty[]>({
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
        mutationFn: ({ facultyId, updatedData }: { facultyId: string; updatedData: Partial<Faculty> }) =>
            putFaculty(facultyId, updatedData),
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