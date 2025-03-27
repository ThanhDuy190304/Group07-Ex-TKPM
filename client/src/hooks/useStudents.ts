import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPaginatedStudents, postStudent, deleteStudent, putStudent, getAllStudents } from '../api/apiStudents';
import { PaginatedStudents, Student } from '../types/student';

interface PaginatedStudentsParams {
    page: number;
    limit: number;
    searchQuery: Partial<Student>;
}

export function usePaginatedStudents({ page, limit, searchQuery }: PaginatedStudentsParams) {
    const queryClient = useQueryClient();

    const studentsQuery = useQuery<PaginatedStudents>({
        queryKey: ['students', { page, limit, searchQuery }],
        queryFn: () => getPaginatedStudents({ page, limit, searchQuery }),
        placeholderData: (previousData) => previousData
    });

    const createStudent = useMutation({
        mutationFn: postStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });


    const updateStudent = useMutation({
        mutationFn: ({ studentId, updatedData }: { studentId: string; updatedData: Partial<Student> }) =>
            putStudent(studentId, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });


    const removeStudent = useMutation({
        mutationFn: deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });

    return {
        studentsQuery,
        updateStudent,
        createStudent,
        removeStudent,
    };
}

export function useAllStudents(searchQuery: Partial<Student> = {}) {
    const studentsQuery = useQuery<Student[]>({
        queryKey: ['students', searchQuery],
        queryFn: () => getAllStudents(searchQuery),
    });

    return { studentsQuery };
}
