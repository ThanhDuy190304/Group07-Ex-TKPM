import { Address } from "./address";
import { IdentityDocument } from "./identityDocument";
import { Gender, StudentStatus } from "./enum";

export interface Student {
    id: string;
    studentCode: string;
    fullName: string;
    dateOfBirth: string;
    gender: Gender;
    email: string;
    phoneNumber: string;
    mailAddress: Address;
    permanentAddress: Address;
    temporaryResidenceAddress: Address;
    nationality: string;
    facultyCode: string | null;
    programCode: string | null;
    status: StudentStatus
    cohortYear: string;
    identityDocuments: IdentityDocument[]
}

export const studentFieldKeys: Record<Exclude<keyof Student, 'id'>, string> = {
    studentCode: "studentCode",
    fullName: "fullName",
    dateOfBirth: "dateOfBirth",
    gender: "gender",
    email: "email",
    phoneNumber: "phoneNumber",
    mailAddress: "mailAddress",
    permanentAddress: "permanentAddress",
    temporaryResidenceAddress: "temporaryResidenceAddress",
    facultyCode: "facultyCode",
    cohortYear: "cohortYear",
    programCode: "programCode",
    nationality: "nationality",
    status: "status",
    identityDocuments: "identityDocuments",
};
