const EnumService = require("../service/enum.service");

async function getStudentStatusTypes(req, res) {
    try {
        const statusTypes = await EnumService.getStudentStatusTypes();
        res.status(200).json({ data: statusTypes });
    } catch (error) {
        next(error);
    }
}

async function getSemesterTypes(req, res, next) {
    try {
        const semesterTypes = await EnumService.getSemesterTypes();
        res.status(200).json({ data: semesterTypes });
    } catch (error) {
        next(error);
    }
}

async function getGenderTypes(req, res, next) {
    try {
        const genderTypes = await EnumService.getGenderTypes();
        res.status(200).json({ data: genderTypes });
    } catch (error) {
        next(error);
    }
}

async function getIdentityTypes(req, res, next) {
    try {
        const identityTypes = await EnumService.getIdentityTypes();
        res.status(200).json({ data: identityTypes });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getStudentStatusTypes,
    getSemesterTypes,
    getGenderTypes,
    getIdentityTypes
};