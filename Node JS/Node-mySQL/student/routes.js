const { Router } = require('express');
const controller = require('./controller');

const router = Router();

router.get('/', (req, res) => {
    res.send("Hello world this is from router!")
});

router.get('/', (controller.getStudent))
module.exports = router;