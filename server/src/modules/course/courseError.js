const CourseError = {
    NOT_FOUND: {
        code: 'COURSE_NOT_FOUND',
        message: 'Không tìm thấy khoá',
    },

    INVALID_DATA: {
        code: 'INVALID_COURSE_DATA',
        message: 'Dữ liệu khoá không hợp lệ',
    },

    DUPLICATE: {
        code: 'DUPLICATE_COURSE',
        message: 'Khoá đã tồn tại',
    },

    INTERNAL_ERROR: {
        code: 'COURSE_SERVER_ERROR',
        message: 'Lỗi server khi xử lý khóa',
    }
};

module.exports = CourseError;