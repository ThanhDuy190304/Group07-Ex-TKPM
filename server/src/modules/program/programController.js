const ProgramService = require("./programService")
const logger = require('../../logger');

async function getPrograms(req, res) {
    try {
        logger.info('getPrograms');
        const programs = await ProgramService.getAllPrograms();
        return res.status(200).json(programs);
    } catch (error) {
        logger.error('Error getPrograms', {message: error.message, stack: error.stack});
        return res.status(500).json({ error: error.message });
    }
}

async function postProgram(req, res) {
    try {
        logger.info('postProgram');
        const programs = await ProgramService.createProgram(req.body);
        return res.status(200).json(programs);
    } catch (error) {
        logger.error('Error postProgram', {message: error.message, stack: error.stack});
        return res.status(500).json({ error: error.message });
    }
}

async function putProgram(req, res) {
    try {
        logger.info('putProgram');
        const programId = req.params.programId;
        const updatedData = req.body;
        const result = await ProgramService.updateProgram(programId, updatedData);
        if (!result) {
            logger.warn('Warn putProgram', {programId});
            return res.status(404).json({ message: "Program not found!" });
        }
        return res.status(200).json(result);
    } catch (error) {
        logger.error('Error putProgram', {message: error.message, stack: error.stack});
        return res.status(500).json({ error: error.message });
    }
}

module.exports = { getPrograms, postProgram, putProgram };
