const FacultyService = require("./facultyService");

async function getFaculties(req, res) {
    try {
        const faculties = await FacultyService.getAllFaculties();
        return res.status(200).json(faculties);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function postFaculty(req, res) {
    try {
        const faculty = await FacultyService.createFaculty(req.body);
        return res.status(200).json(faculty);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function putFaculty(req, res) {
    try {
        const facultyId = req.params.facultyId;
        const updatedData = req.body;
        const result = await FacultyService.updateFaculty(facultyId, updatedData);
        if (!result) {
            return res.status(404).json({ message: "Faculty not found!" });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getFaculties, postFaculty, putFaculty };
