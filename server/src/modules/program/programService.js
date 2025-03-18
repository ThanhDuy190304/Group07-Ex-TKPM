const Program = require("./programModel");

async function getAllPrograms() {
    try {
        const programs = await Program.findAll({
            attributes: ["programId", "name"], // Chỉ lấy programId
        });
        return programs;
    } catch (error) {
        console.error("Error in programService.getAllPrograms:", error.message);
        throw new Error("Error server");
    }
}

module.exports = { getAllPrograms };
