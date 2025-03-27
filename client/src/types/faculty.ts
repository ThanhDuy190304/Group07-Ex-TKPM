export interface Faculty {
    facultyId: string,
    name: string
    short_name: string,
}

export const facultyFields: Partial<Record<keyof Faculty, string>> = {
    name: "Tên khoa",
    short_name: "Mã khoa",
};