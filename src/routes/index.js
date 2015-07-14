import express from 'express';

let router = express.Router();

router.use(function (req, res) {
    res.status(404).end();
});

export default router;