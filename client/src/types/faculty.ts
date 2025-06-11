export interface Faculty {
    id: string,
    name: string
    facultyCode: string,
}

export const facultyFieldKeys: Record<'facultyCode' | 'name', string> = {
    facultyCode: "facultyCode",
    name: "name",
};
