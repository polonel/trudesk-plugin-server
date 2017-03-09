import mongoose from 'mongoose';
import winston from 'winston';
import Bluebird from 'bluebird';

mongoose.connection.on ('error', (e) => {
    winston.error('Unable to connect to MongoDB! - ' + e.message);
});

mongoose.connection.on('connected', () => {
    winston.info('Connected to MongoDB');
});

const env = process.env.NODE_ENV || 'development';

const options = { server: { auto_reconnect: true, socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 }}};
let CONNECTIONURI = 'mongodb://' + process.env.MONGODB_PORT_27017_TCP_ADDR + ':27017/' + process.env.MONGODB_DATABASE_NAME;
if (env == 'development')
    CONNECTIONURI = 'mongodb://trudesk:%23TruDesk1%24@ds017736.mlab.com:17736/trudesk';

let db = {};

const DBInit = (callback) => {
    winston.info('Running in: ' + env);
    if (db.connection) {
        return callback(null, db);
    } else {
        mongoose.Promise = Bluebird;
        // mongoose.Promise = global.Promise;
        mongoose.connect(CONNECTIONURI, options, (e) => {
            if (e) return callback(e, null);
            db.connection = mongoose.connection;

            return callback(null, db);
        })
    }
};

export {
    DBInit,
    db
};