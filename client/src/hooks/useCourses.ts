import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCourses } from "../api/apiCoures";
import { Course } from "../types/course";

export function useCourses() {

    const coursesQuery = useQuery<Course[]>({
        queryKey: ["courses"],
        queryFn: getCourses,
    });

    return {
        coursesQuery,

    };
}
