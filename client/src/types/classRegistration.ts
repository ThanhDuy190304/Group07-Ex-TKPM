export interface ClassRegistration {
    classCode: string;
    studentCode: string;
    note: string | null;
    isPass: boolean | null
    grade: Float32Array | null;
}


export const ClassRegistrationFieldKeys: Record<keyof ClassRegistration, string> = {
    classCode: "classCode",
    studentCode: "studentCode",
    grade: "grade",
    isPass: "isPass",
    note: "note",
};
