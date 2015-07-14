import path from 'path';
import chalk from 'chalk';
import util from 'util';
import env from '../env';

let rootPath = path.join(__dirname, '/');
let indexPath = path.join(rootPath, './template/index.html');
let faviconPath = path.join(rootPath, './public/favicon.ico');

let logMiddleware = function (req, res, next) {
    util.log(('---NEW REQUEST---'));
    console.log(util.format(chalk.red('%s: %s %s'), 'REQUEST ', req.method, req.path));
    console.log(util.format(chalk.yellow('%s: %s'), 'QUERY   ', util.inspect(req.query)));
    console.log(util.format(chalk.cyan('%s: %s'), 'BODY    ', util.inspect(req.body)));
    next();
};

let variables = function (app) {
    app.setValue('env', env);
    app.setValue('projectRoot', rootPath);
    app.setValue('indexHTMLPath', indexPath);
    app.setValue('faviconPath', faviconPath);
    app.setValue('log', logMiddleware);
};

export default variables;