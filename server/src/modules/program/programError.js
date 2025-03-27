const ProgramError = {
    NOT_FOUND: {
        code: 'PROGRAM_NOT_FOUND',
        message: 'Không tìm thấy chương trình học',
    },

    INVALID_DATA: {
        code: 'INVALID_PROGRAM_DATA',
        message: 'Dữ liệu chương trình học không hợp lệ',
    },

    DUPLICATE: {
        code: 'DUPLICATE_PROGRAM',
        message: 'Chương trình học đã tồn tại',
    },

    INTERNAL_ERROR: {
        code: 'PROGRAM_SERVER_ERROR',
        message: 'Lỗi server khi xử lý chương trình học',
    }
};

module.exports = ProgramError;