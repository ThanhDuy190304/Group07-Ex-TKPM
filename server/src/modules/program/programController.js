const ProgramService = require("./programService")

async function getPrograms(req, res) {
    try {
        const programs = await ProgramService.getAllPrograms();
        return res.status(200).json(programs);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getPrograms };
