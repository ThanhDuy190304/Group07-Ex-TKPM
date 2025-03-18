export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không hợp lệ. Vui lòng nhập đúng định dạng (ví dụ: example@gmail.com).";
    return null; // null nghĩa là không có lỗi
}

export function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/; // Chỉ cần đúng 10 chữ số
    if (!phoneRegex.test(phone)) return "Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số.";
    return null;
}

export function validateBirthdate(birthdate) {
    const birthdateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!birthdateRegex.test(birthdate)) {
        return "Ngày sinh không hợp lệ";
    }
    // Chuyển đổi chuỗi ngày sinh sang đối tượng Date
    const birthDateObj = new Date(birthdate);
    const currentDate = new Date();
    // Kiểm tra xem ngày sinh có lớn hơn ngày hiện tại không
    if (birthDateObj > currentDate) {
        return "Ngày sinh không hợp lệ. Vui lòng nhập ngày sinh phải nhỏ hơn hoặc bằng ngày hiện tại.";
    }
    return null;
}

export function validateNotEmptyFields(object) {
    for (const key in object) {
        if (
            object[key] === null ||
            object[key] === undefined ||
            (typeof object[key] === "string" && object[key].trim() === "") ||
            (Array.isArray(object[key]) && object[key].length === 0)
        ) {
            return `Vui lòng không để trống bất kỳ trường nào.`;
        }
    }
    return null; // Không có lỗi
}
