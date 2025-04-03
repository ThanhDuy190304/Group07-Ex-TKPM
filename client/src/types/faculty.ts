export interface Faculty {
    id: string,
    name: string
    facultyCode: string,
}

export const facultyFields: Partial<Record<keyof Faculty, string>> = {
    facultyCode: "Mã khoa",
    name: "Tên khoa",
};