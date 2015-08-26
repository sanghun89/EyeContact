import express from 'express';
import record from './record';

let router = express.Router();

router.use('/record', record);

router.use(function (req, res) {
    res.status(404).end();
});

export default router;
