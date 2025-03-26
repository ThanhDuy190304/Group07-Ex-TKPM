const FacultyService = require("./facultyService");

async function getFaculties(req, res) {
    try {
        const result = await FacultyService.getAllFaculties();
        if (result.success) {
            return res.status(200).json({ data: result.faculties });
        }
        return res.status(500).json({ error: "Lỗi server" });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

async function postFaculty(req, res) {
    try {
        const result = await FacultyService.createFaculty(req.body);
        if (result.success) {
            return res.status(201).json({ data: result.faculty });
        }
        return res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

async function putFaculty(req, res) {
    try {
        const facultyId = req.params.facultyId;
        const updatedData = req.body;
        const result = await FacultyService.updateFaculty(facultyId, updatedData);
        if (result.success) {
            return res.status(201).json({ data: result.faculty });
        }
        return res.status(400).json({ error: result.error });
    } catch (error) {
        return res.status(500).json({ error: error });
    }
}

module.exports = { getFaculties, postFaculty, putFaculty };
