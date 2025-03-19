const ProgramService = require("./programService")

async function getPrograms(req, res) {
    try {
        const programs = await ProgramService.getAllPrograms();
        return res.status(200).json(programs);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function postProgram(req, res) {
    try {
        const programs = await ProgramService.createProgram(req.body);
        return res.status(200).json(programs);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

async function putProgram(req, res) {
    try {
        const programId = req.params.programId;
        const updatedData = req.body;
        const result = await ProgramService.updateProgram(programId, updatedData);
        if (!result) {
            return res.status(404).json({ message: "Program not found!" });
        }
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getPrograms, postProgram, putProgram };
