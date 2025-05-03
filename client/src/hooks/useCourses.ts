import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourses, postCourses, deleteCourse } from "../api/apiCourses";
import { Course } from "../types/course";

export function useCourses() {
    const queryClient = useQueryClient();

    const coursesQuery = useQuery({
        queryKey: ["courses"],
        queryFn: getCourses,
    });

    const createCourse = useMutation({
        mutationFn: (newCourse: Partial<Course>) => postCourses(newCourse),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
        },
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
    };
}
