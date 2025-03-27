import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPrograms, postProgram, putProgram } from "../api/apiPrograms";
import { Program } from "../types/program";

export function usePrograms() {
    const queryClient = useQueryClient();

    const programsQuery = useQuery<Program[]>({
        queryKey: ["programs"],
        queryFn: getPrograms,
    });

    const createProgram = useMutation({
        mutationFn: (newProgram: Partial<Program>) => postProgram(newProgram),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["programs"],
            });
        },
    });

    const updateProgram = useMutation({
        mutationFn: ({ programId, updatedData }: { programId: string; updatedData: Partial<Program> }) =>
            putProgram(programId, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["programs"],
            });
        },
    });

    return {
        programsQuery,
        createProgram,
        updateProgram,
    };
}