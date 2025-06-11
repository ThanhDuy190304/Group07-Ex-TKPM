export interface Program {
    id: string,
    name: string,
    programCode: string,
}
export const programFieldKeys: Record<'programCode' | 'name', string> = {
    programCode: "programCode",
    name: "name",
};
