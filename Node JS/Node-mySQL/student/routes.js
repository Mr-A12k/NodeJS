const { Router } = require('express');
const controller = require('./controller');

const router = Router();

// router.get('/', (req, res) => {
//     res.send("Hello world this is from router!")
// });

router.get('/', (controller.getStudents));
router.post('/',(controller.addStudent));
router.get('/:id',(controller.getStudentId));
module.exports = router;