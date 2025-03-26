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
    });

    const createStudent = useMutation({
        mutationFn: postStudent,
        onSuccess: (newStudent: Student) => {
            queryClient.setQueryData<PaginatedStudents>(
                ['students', { page, limit, searchQuery }],
                (oldData) => {
                    if (!oldData) return { students: [newStudent], total: 1 };
                    return {
                        students: [...oldData.students, newStudent],
                        total: oldData.total + 1
                    };
                }
            );
        },
    });

    const updateStudent = useMutation({
        mutationFn: ({ studentId, updatedData }: { studentId: string; updatedData: Partial<Student> }) => putStudent(studentId, updatedData),
        onSuccess: (updatedStudent: Student) => {
            queryClient.setQueryData<PaginatedStudents>(
                ['students', { page, limit, searchQuery }],
                (oldData) => {
                    if (!oldData) return undefined;
                    return {
                        students: oldData.students.map(student =>
                            student.studentId === updatedStudent.studentId ? updatedStudent : student
                        ),
                        total: oldData.total
                    };
                }
            );
        },
    });

    const removeStudent = useMutation({
        mutationFn: deleteStudent,
        onSuccess: (_, studentId: string) => {
            queryClient.setQueryData<PaginatedStudents>(
                ['students', { page, limit, searchQuery }],
                (oldData) => {
                    if (!oldData) return undefined;
                    return {
                        students: oldData.students.filter(s => s.studentId !== studentId),
                        total: oldData.total - 1
                    };
                }
            );
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
