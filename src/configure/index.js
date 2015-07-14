import variables from './app-variable';
import statics from './static-middleware';
import parses from './parsing-middleware';


let configuration = function (app) {

    // setValue and getValue are merely alias
    // for app.set and app.get used in the less
    // common way of setting application variables.
    app.setValue = app.set.bind(app);

    app.getValue = function (path) {
        return app.get(path);
    };

    variables(app);
    statics(app);
    parses(app);

    // Logging middleware, set as application
    // variable inside of server/app/configure/app-variables.js
    app.use(app.getValue('log'));
};

export default configuration;