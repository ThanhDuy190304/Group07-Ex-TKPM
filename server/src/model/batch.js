const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Batch = sequelize.define(
  "Batch1",
  {
    batchId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    startYear: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "batchs1",
    hooks: {
      beforeCreate: (batch) => {
        // Nếu chưa có batchId, tự động tạo từ năm hiện tại
        if (!batch.batchId) {
          const currentYear = new Date().getUTCFullYear();
          batch.batchId = `K${currentYear}`;
          batch.startYear = currentYear;
        }
      },
    },
  }
);

module.exports = Batch;
