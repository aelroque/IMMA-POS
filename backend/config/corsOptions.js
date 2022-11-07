import allowedOrigins from './allowedOrigins.js';
//const allowedOrigins = require('./allowedOrigins.js');

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
}

export default corsOptions;