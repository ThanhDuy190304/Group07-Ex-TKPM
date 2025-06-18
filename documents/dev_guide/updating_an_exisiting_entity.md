# Cập nhật Entity có sẵn

## 🎯 Mục đích

Hướng dẫn cách **bổ sung thuộc tính (property)** mới vào một entity đã tồn tại mà không cần viết lại toàn bộ hoặc xóa database – tức là **mở rộng schema & mapping**, có thể áp dụng cả cho core lẫn plugin.

---

## Cách thực hiện cập nhật entity

Ví dụ: muốn thêm middle name vào student model

1. **Thêm field vào Sequelize model**  

```js
middleName: {
  type: DataTypes.STRING,
  allowNull: true,
},
```

2. **Tạo migration file để cập nhật schema**

```
npx sequelize-cli migration:generate --name add-middle-name-to-student
```

Mở file migration vừa tạo và viết

```js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("students", "middle_name", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn("students", "middle_name");
  }
};
```

3. **Chạy mirgration**

```
npx sequelize-cli db:migrate
```

4. **Cập nhật lại service**
5. **Viết test cho service đó** 
