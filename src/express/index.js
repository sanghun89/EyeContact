import express from 'express';
import configure from '../configure';
import routes from '../routes';
import path from 'path';

let app = express();

configure(app);

app.use('/api', routes);

app.use((req, res, next) => {
    if (path.extname(req.path).length > 0) {
        res.status(404).end();
    } else {
        next(null);
    }
});

app.get('/*', (req, res) => {
    res.sendFile(app.get('indexHTMLPath'));
});

// Error catching endware.
app.use((err, req, res, next) => {
    console.error(err, typeof next);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
});


export default app;