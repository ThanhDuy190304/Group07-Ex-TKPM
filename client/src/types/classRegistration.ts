export interface ClassRegistration {
    classCode: string;
    studentCode: string;
    note: string;
    grade: Float32Array;
}


export const ClassRegistrationFieldKeys: Record<keyof ClassRegistration, string> = {
    classCode: "classCode",
    studentCode: "studentCode",
    note: "note",
    grade: "grade",
};
