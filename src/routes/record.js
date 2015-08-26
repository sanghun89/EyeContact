import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';

const Record = mongoose.model('Record');

let router = express.Router();

router.post('/', (req, res, next) => {
    if (!req.body || !Object.keys(req.body).length) {
        return next(new Error('Payload is empty'));
    }

    Record.create(req.body)
        .then((record) => {
            res.json(_.omit(record.toObject(), ['data']));
        }, next);
});

export default router;
