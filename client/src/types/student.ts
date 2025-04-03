import { Address } from "./address";
import { IdentityDocument } from "./identityDocument";
import { Gender, StudentStatus } from "./enum";
export interface Student {
    id: string;
    studentCode: string;
    fullName: string;
    dateOfBirth: Date | string;
    gender: Gender;
    email: string;
    phoneNumber: string;
    mailAddress: Address;
    permanentAddress: Address;
    temporaryResidenceAddress: Address;
    nationality: string;
    facultyCode: string;
    programCode: string;
    status: StudentStatus
    cohortYear: string;
    identityDocuments: IdentityDocument[]
}

export const studentFields: Partial<Record<keyof Student, string>> = {
    studentCode: "MSSV",
    fullName: "Họ tên",
    dateOfBirth: "Ngày sinh",
    gender: "Giới tính",
    email: "Email",
    phoneNumber: "SĐT",
    mailAddress: "Địa chỉ nhận thư",
    permanentAddress: "Địa chỉ thường trú",
    temporaryResidenceAddress: "Địa chỉ tạm trú",
    facultyCode: "Khoa",
    cohortYear: "Khóa",
    programCode: "Chương trình",
    nationality: "Quốc tịch",
    status: "Tình trạng",
    identityDocuments: "Giấy tờ tùy thân",
};

