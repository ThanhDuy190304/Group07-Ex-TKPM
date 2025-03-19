const Faculty = require("./facultyModel");

async function getAllFaculties() {
    try {
        const faculties = await Faculty.findAll({
            attributes: ["facultyId", "name", "short_name"], // Chỉ lấy facultyId và name
        });
        return faculties;
    } catch (error) {
        console.error("Error in facultyService.getAllFaculties:", error.message);
        throw new Error("Error server");
    }
}
async function createFaculty(newFaculty) {
    try {
        const faculty = await Faculty.create(newFaculty);
        return faculty;
    } catch (error) {
        console.error("Error in facultyService.createFaculty:", error.message);
        throw new Error("Error server");
    }
}
async function updateFaculty(facultyId, updatedData) {
    try {
        const faculty = await Faculty.findOne({ where: { facultyId } });
        if (!faculty) {
            return null;
        }
        await faculty.update(updatedData);
        return faculty;
    } catch (error) {
        console.error("Error in facultyService.updateFaculty:", error.message);
        throw new Error("Error server");
    }
}

module.exports = { getAllFaculties, createFaculty, updateFaculty };
