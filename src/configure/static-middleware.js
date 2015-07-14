import path from 'path';
import express from 'express';
import favicon from 'serve-favicon';

let statics = function (app) {

    let root = app.getValue('projectRoot');
    let publicPath = path.join(root, './public');

    app.use(favicon(app.getValue('faviconPath')));
    app.use(express.static(publicPath));
};

export default statics;