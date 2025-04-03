const Sequelize = require('sequelize');
const camelcaseKeys = require('camelcase-keys');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Student', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mailAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('mailAddress');
        return rawValue ? camelcaseKeys(rawValue, { deep: true }) : rawValue;
      }
    },
    permanentAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('permanentAddress');
        return rawValue ? camelcaseKeys(rawValue, { deep: true }) : rawValue;
      }
    },
    temporaryResidenceAddress: {
      type: DataTypes.JSONB,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue('temporaryResidenceAddress');
        return rawValue ? camelcaseKeys(rawValue, { deep: true }) : rawValue;
      }
    },
    facultyCode: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'faculties',
        key: 'faculty_code'
      }
    },
    cohortYear: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM("Đang học", "Đã thôi học", "Tạm dừng học",
        "Bảo lưu", "Tốt nghiệp", "Đình chỉ"),
      allowNull: true,
      defaultValue: "Đang học"
    },
    studentCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "students_student_code_key"
    },
    programCode: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'programs',
        key: 'program_code'
      }
    },
    gender: {
      type: DataTypes.ENUM("Khác", "Nam", "Nữ"),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'students',
    schema: 'public',
    timestamps: true,
    indexes: [
      {
        name: "students_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "students_student_code_key",
        unique: true,
        fields: [
          { name: "student_code" },
        ]
      },
    ]
  });
};
