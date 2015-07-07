import http from 'http';
import startDb from './db';
import app from './express';
import chalk from 'chalk';

let server = http.createServer();

let createApplication = function () {
    server.on('request', app); // Attach the Express application.
    //require('./io')(server);   // Attach socket.io.
};

let startServer = function () {

    var PORT = process.env.PORT || 1337;

    server.listen(PORT, () => {
        console.log(chalk.blue('Server started on port', chalk.magenta(PORT)));
        if (process.send) {
            process.send('online');
        } else {
            console.log('The server is running at http://localhost:' + server.get('port'));
        }
    });

};

startDb.then(createApplication).then(startServer).catch(function (err) {
    console.error('Initialization error:', chalk.red(err.message));
    console.error('Process terminating . . .');
    process.kill(1);
});