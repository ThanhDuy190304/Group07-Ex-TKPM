export interface Course {
    id: string,
    courseCode: string,
    name: string,
    credits: number,
    isActive: boolean,
    facultyCode: string,
    description: string,
    prerequisiteCourseCode: string[],
}

export const CourseFieldKeys: Record<Exclude<keyof Course, 'id'>, string> = {
    courseCode: "courseCode",
    name: "name",
    credits: "credits",
    facultyCode: "facultyCode",
    description: "description",
    prerequisiteCourseCode: "prerequisiteCourseCode",
    isActive: "isActive",
};
