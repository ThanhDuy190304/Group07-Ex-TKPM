const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('IdentityDocuments', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    studentCode: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'students',
        key: 'student_code'
      }
    },
    type: {
      type: DataTypes.ENUM("CCCD", "CMND", "Passport"),
      allowNull: false
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    placeOfIssue: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    country: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    hasChip: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "identity_documents_identity_document_code_key"
    }
  }, {
    sequelize,
    tableName: 'identity_documents',
    schema: 'public',
    indexes: [
      {
        name: "identity_documents_identity_document_code_key",
        unique: true,
        fields: [
          { name: "identity_document_code" },
        ]
      },
      {
        name: "identity_documents_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
