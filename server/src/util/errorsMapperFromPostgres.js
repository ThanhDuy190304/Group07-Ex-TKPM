const { ValidationError, DuplicateResourceError, InternalServerError } = require('./errors');

function mapSequelizeError(err) {
    if (!err || !err.name) return err;

    switch (err.name) {
        case 'SequelizeForeignKeyConstraintError':
            return new ValidationError(
                'The data you entered is not valid because it is linked to other information. Please check and try again.',
                'Dữ liệu bạn nhập không hợp lệ do đang liên kết với thông tin khác. Vui lòng kiểm tra và thử lại.'
            );
        case 'SequelizeUniqueConstraintError':
            return new DuplicateResourceError();
        case 'SequelizeValidationError':
            return new ValidationError();
        case 'SequelizeDatabaseError':
            return new InternalServerError('Error Server', 'Lỗi cơ sở dữ liệu.');
        default:
            return err;
    }
}

module.exports = { mapSequelizeError };
