const sequelize = require("../config/db");
const initModels = require("../models/init-models");
const models = initModels(sequelize);


class EnumService {
    constructor() {
        this.models = models;
    }

    async #getEnumValues(modelName, attributeName) {
        const model = this.models[modelName];
        if (!model) {
            throw new Error(`Model ${modelName} not found`);
        }
        const attribute = model.rawAttributes[attributeName];
        if (!attribute) {
            throw new Error(`Attribute ${attributeName} not found in model ${modelName}`);
        }
        if (!attribute.type || !attribute.type.constructor.name === 'ENUM' || !attribute.values) {
            throw new Error(`Attribute ${attributeName} is not an ENUM type`);
        }
        return attribute.values;
    }
    async getStudentStatusTypes() {
        return this.#getEnumValues('Student', 'status');
    }
    async getSemesterTypes() {
        return this.#getEnumValues('Class', 'semester');
    }
    async getGenderTypes() {
        return this.#getEnumValues('Student', 'gender');
    }
    async getIdentityTypes() {
        return this.#getEnumValues('IdentityDocument', 'type');
    }
}

module.exports = new EnumService();
