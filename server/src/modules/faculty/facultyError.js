const FacultyError = {
    NOT_FOUND: {
        code: 'FACULTY_NOT_FOUND',
        message: 'Không tìm thấy khoa',
    },

    INVALID_DATA: {
        code: 'INVALID_FACULTY_DATA',
        message: 'Dữ liệu khoa không hợp lệ',
    },

    INTERNAL_ERROR: {
        code: 'FACULTY_SERVER_ERROR',
        message: 'Lỗi server khi xử lý khoa',
    }
};

module.exports = FacultyError;