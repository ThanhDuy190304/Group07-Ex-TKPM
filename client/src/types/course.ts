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

export const KeyNameOfCourse: Partial<Record<keyof Course, string>> = {
    courseCode: "Mã khóa học",
    name: "Tên",
    credits: "Số tín chỉ",
    facultyCode: "Mã khoa",
    description: "Mô tả",
    prerequisiteCourseCode: "Môn tiên quyết",
    isActive: "Trạng thái",
}