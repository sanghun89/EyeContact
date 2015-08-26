import Promise from 'bluebird';
import chalk from 'chalk';

import {DATABASE_URI} from '../env';
import mongoose from 'mongoose';

let db = mongoose.connect(DATABASE_URI).connection;

import './models';

console.log(chalk.yellow('Opening connection to MongoDB . . .'));

let startDbPromise = new Promise((resolve, reject) => {
    db.on('open', resolve);
    db.on('error', reject);
});

startDbPromise.then(function () {
    console.log(chalk.green('MongoDB connection opened!'));
});

export default startDbPromise;
