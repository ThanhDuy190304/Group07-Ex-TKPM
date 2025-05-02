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