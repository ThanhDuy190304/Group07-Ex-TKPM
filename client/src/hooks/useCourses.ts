import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourses, postCourses, deleteCourse, putCourse } from "../api/apiCourses";
import { Course } from "../types/course";

export function useCourses() {
    const queryClient = useQueryClient();

    const coursesQuery = useQuery({
        queryKey: ["courses"],
        queryFn: getCourses,
        refetchOnWindowFocus: false,
    });

    const createCourse = useMutation({
        mutationFn: (newCourse: Partial<Course>) => postCourses(newCourse),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });

    const updateCourse = useMutation({
        mutationFn: ({ courseId, updatedCourse, }: {
            courseId: string; updatedCourse: Partial<Course>;
        }) => putCourse({ courseId, updatedCourse }),

        onSuccess: (_, { courseId, updatedCourse }) => {
            queryClient.setQueryData<{ courses: Course[] }>(['courses'], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    courses: oldData.courses.map((course) =>
                        course.id === courseId ? { ...course, ...updatedCourse } : course
                    ),
                };
            });
        }
    });

    const removeCourse = useMutation({
        mutationFn: (courseId: string) => deleteCourse(courseId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
    });

    return {
        coursesQuery,
        createCourse,
        removeCourse,
        updateCourse
    };
}
