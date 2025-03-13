const Faculty = require("./facultyModel");

async function getAllFaculties() {
    try {
        const faculties = await Faculty.findAll({
            attributes: ["facultyId", "name"], // Chỉ lấy facultyId và name
        });
        return faculties;
    } catch (error) {
        console.error("Error in facultyService.getAllFaculties:", error.message);
        throw new Error("Error server");
    }
}

module.exports = { getAllFaculties };
