import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postStudent, deleteStudent, putStudent, getAllStudents, deleteStudents, getResultByStudentCode } from '../api/apiStudents';
import { Student } from '../types/student';


export function useStudents(searchQuery: Partial<Student> & { page?: number; limit?: number }) {

    const queryClient = useQueryClient();

    const studentsQuery = useQuery({
        queryKey: ['students', searchQuery],
        queryFn: () => getAllStudents(searchQuery),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    })

    const createStudent = useMutation({
        mutationFn: (newStudentInfo: Partial<Student>) => postStudent(newStudentInfo),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
        },
    });


    const updateStudent = useMutation({
        mutationFn: ({ studentId, updatedData }: { studentId: string; updatedData: Partial<Student> }) =>
            putStudent(studentId, updatedData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['students']
            });
        },
    });

    const removeStudent = useMutation({
        mutationFn: (studentId: string) => deleteStudent(studentId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['students', JSON.stringify(searchQuery)]
            });
        },
    });

    const removeStudents = useMutation({
        mutationFn: (studentIds: string[]) => deleteStudents(studentIds),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['students', searchQuery]
            });
        },
    });

    return {
        studentsQuery,
        updateStudent,
        createStudent,
        removeStudent,
        removeStudents
    };
}

export function useResultOfStudent(studentCode: string, searchQuery: { semester?: string; academicYear?: number }) {
    const queryClient = useQueryClient();

    const resultQuery = useQuery({
        queryKey: ['studentResult', studentCode, searchQuery],
        queryFn: () => getResultByStudentCode(studentCode, searchQuery),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    return {
        resultQuery,
    };
}