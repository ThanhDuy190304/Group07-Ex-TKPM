export interface Class {
    id: string;
    classCode: string;
    courseCode: string;
    semester: string;
    academicYear: string;
    instructor: string;
    maxStudents: number;
    room: string;
    schedule: string;
}


export const ClassFieldKeys: Record<Exclude<keyof Class, 'id'>, string> = {
    classCode: "classCode",
    courseCode: "courseCode",
    semester: "semeter",
    academicYear: "academicYear",
    instructor: "instructor",
    maxStudents: "maxStudent",
    room: "room",
    schedule: "schedule",
};