import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPrograms, postProgram, putProgram } from '../api/apiPrograms';
import { Program } from '../types/program'

export function usePrograms() {
    const queryClient = useQueryClient();

    const programsQuery = useQuery<Program[]>({
        queryKey: ["programs"],
        queryFn: getPrograms,
    });

    const updateProgram = useMutation({
        mutationFn: ({ programId, updatedData }: { programId: string; updatedData: Partial<Program> }) =>
            putProgram(programId, updatedData),
        onSuccess: (updatedProgram: Program) => {
            queryClient.setQueryData<Program[]>(["programs"], (oldPrograms) => {
                if (!oldPrograms) return [];
                return oldPrograms.map((program) =>
                    program.programId === updatedProgram.programId ? updatedProgram : program
                );
            });
        },
    });

    const createProgram = useMutation({
        mutationFn: (newProgram: Program) => postProgram(newProgram),
        onSuccess: (createdProgram: Program) => {
            queryClient.setQueryData<Program[]>(["programs"], (oldPrograms) => {
                if (!oldPrograms) return [createdProgram];
                return [...oldPrograms, createdProgram];
            });
        },
    });

    return {
        programsQuery,
        updateProgram,
        createProgram,
    };
}
