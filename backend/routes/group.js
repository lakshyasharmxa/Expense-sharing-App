const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const groupController = require('../controller/groupsController');

router.use(auth);

router.post('/', groupController.createGroup);
router.post('/join', groupController.joinGroup);
router.get('/', groupController.getUserGroups);
router.get('/:id', groupController.getGroupById);

module.exports = router;