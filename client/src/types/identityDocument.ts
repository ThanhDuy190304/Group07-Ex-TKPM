import { IdentityDocumentType } from "./enum";

// Interface cơ bản cho các trường chung
export interface BaseIdentityDocument {
    id: string; // UUID của tài liệu định danh
    number: string; // Số định danh
    type: IdentityDocumentType; // Loại tài liệu định danh
    issueDate: string; // Ngày cấp
    expiryDate: string; // Ngày hết hạn
    placeOfIssue: string; // Nơi cấp
    country: string; // Quốc gia cấp
}

export interface CCCDIdentityDocument extends BaseIdentityDocument {
    type: IdentityDocumentType.CCCD;
    hasChip: boolean;
}

export interface CMNDIdentityDocument extends BaseIdentityDocument {
    type: IdentityDocumentType.CMND;
}

export interface PassportIdentityDocument extends BaseIdentityDocument {
    type: IdentityDocumentType.Passport;
    notes: string;
}

export type IdentityDocument = CCCDIdentityDocument | CMNDIdentityDocument | PassportIdentityDocument;

// Tên tiếng Việt cho các trường (phân loại theo loại giấy tờ)
export const identityDocumentFields: Record<string, Partial<Record<string, string>>> = {
    common: {
        type: "Loại giấy tờ",
        issueDate: "Ngày cấp",
        expiryDate: "Ngày hết hạn",
        placeOfIssue: "Nơi cấp",
        country: "Quốc gia cấp",
        number: "Số giấy tờ",
    },
    cccd: {
        hasChip: "Có chip", // Chỉ áp dụng cho CCCD
    },
    passport: {
        notes: "Ghi chú", // Chỉ áp dụng cho Passport
    },
};

export function formatIdentityDocument(document: IdentityDocument): string {
    const commonFields = [
        document.type,
        document.number,
        document.issueDate,
        document.expiryDate,
        document.placeOfIssue,
        document.country,
    ];

    let specificFields: string[] = [];

    // Xử lý các trường đặc thù theo loại giấy tờ
    if (document.type === IdentityDocumentType.CCCD) {
        specificFields = [document.hasChip ? "Có chip" : "Không chip"];
    } else if (document.type === IdentityDocumentType.Passport) {
        specificFields = [document.notes];
    }

    // Kết hợp các trường chung và đặc thù, sau đó nối bằng dấu phẩy
    return [...commonFields, ...specificFields].join(", ");
}