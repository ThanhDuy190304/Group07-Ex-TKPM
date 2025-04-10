const CourseService = require("../service/course.service");

const getAll = async(req, res, next) => {
    try{
        const response = await CourseService.getAll();
        return res.status(200).json({data: response});
    }catch(error){
        next(error);
    }
}

const create = async (req, res, next) => {
    try {
        const result = await CourseService.create(req.body);
        return res.status(201).json({ data: result });
    } catch (error) {
        next(error);
    }
}

const remove = async(req, res, next) =>{
    try{
        await CourseService.delete(req,params.courseCode);
        return res.status(204).send();
    }catch(error){
        next(error);
    }
}

module.exports = {
    getAll,
    create,
    remove,
}