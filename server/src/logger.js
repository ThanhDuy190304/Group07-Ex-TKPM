const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'HH:mm:ss DD-MM-YYYY'
        }),
        winston.format.json()
    ),
    transports:[
        new winston.transports.Console(),
        new winston.transports.File({filename: 'combined.log'})
    ]
});

module.exports = logger;
