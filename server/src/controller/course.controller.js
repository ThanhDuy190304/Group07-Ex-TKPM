const CourseService = require("../service/course.service");

const courseService = new CourseService();

const getAll = async (req, res, next) => {
    try {
        const response = await courseService.getAll();
        return res.status(200).json({ data: response });
    } catch (error) {
        next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await courseService.create(req.body);
        return res.status(201).json({ data: result });
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const courseCode = req.params.courseCode;
        const updateData = req.body;
        const result = await courseService.update(courseCode, updateData);
        return res.status(200).json({ data: result });
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        await courseService.delete(req.params.courseCode);
        return res.status(204).send();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getAll,
    create,
    update,
    remove,
}