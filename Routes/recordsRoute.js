const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
const { creatRecord,updateRecord,getRecords,getRecordsByUser} = require('../controllers/recordController')
// const Record = require('../models/Record');


router.post('/add/', protect, creatRecord);

//updateRecord
router.patch('/updateRecord/:id', updateRecord);

//getRecords
router.get('/getRecords/:id', getRecordsByUser);

//getAllRecords
router.get('/getRecords', getRecords);


module.exports = router;