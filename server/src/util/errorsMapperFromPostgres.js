const { ValidationError, DuplicateResourceError } = require('./errors');

function mapSequelizeError(err) {
    if (!err || !err.name) return err;

    switch (err.name) {
        case 'SequelizeForeignKeyConstraintError':
            return new ValidationError(`'This item cannot be deleted because it’s linked to other data. Please check the dependencies first.`,
                'Không thể xoá do dữ liệu đang được sử dụng. Vui lòng kiểm tra lại các mục liên quan trước.');
        case 'SequelizeUniqueConstraintError':
            return new DuplicateResourceError();
        case 'SequelizeValidationError':
            return new ValidationError();
        case 'SequelizeDatabaseError':
            return new ValidationError('Error Server', 'Lỗi cơ sở dữ liệu.');
        default:
            return err;
    }
}

module.exports = { mapSequelizeError };
