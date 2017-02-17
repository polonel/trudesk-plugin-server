import http from 'http';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import winston from 'winston';
import {DBInit, db} from './database';

let app = express();
app.server = http.createServer(app);

global.env = process.env.NODE_ENV || 'development';

winston.setLevels(winston.config.cli.levels);
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {
    colorize: true,
    timestamp: function() {
        var date = new Date();
        return (date.getMonth() + 1) + '/' + date.getDate() + ' ' + date.toTimeString().substr(0,8) + ' [' + global.process.pid + ']';
    },
    level: global.env === 'production' ? 'info' : 'verbose'
});

//Dev Stuff
if (global.env === 'development') {
    let webpack = require('webpack');
    let webpackConfig = require('../../webpack.config');
    let compiler = webpack(webpackConfig);

    winston.debug('using webpack middleware');
    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true
    }));
    app.use(require('webpack-hot-middleware')(compiler));
}

app.use(express.static('build'));
app.use('/plugin/download/', express.static(path.join(__dirname, 'plugins')));
app.use(bodyParser.json());

DBInit((e, db) => {
    if (e) {
        winston.error(e);
        throw new Error(e);
    }
    
    app.use(router());

    app.server.listen(3000);
    winston.info('Server listing...');
});



export default app;