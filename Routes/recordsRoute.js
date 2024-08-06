const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware');
<<<<<<< HEAD
const { creatRecord,updateRecord,getRecords,getRecordsByUser,deleteRecord} = require('../controllers/recordController')
// const Record = require('../models/Record');
=======
const { creatRecord,updateRecord,getRecords,getRecordsByUser,deleteRecord } = require('../controllers/recordController')
>>>>>>> e5515e3761d749547d399b1d4d4a7f3ba146b6ec


router.post('/add/',protect, creatRecord);

//updateRecord
router.patch('/updateRecord/:id', updateRecord);

//getRecords
router.get('/getRecords/:id', getRecordsByUser);

//getAllRecords
router.get('/getRecords', getRecords);

//deleteRecord
router.delete('/deleteRecord/:id', deleteRecord);
<<<<<<< HEAD


=======
>>>>>>> e5515e3761d749547d399b1d4d4a7f3ba146b6ec
module.exports = router;