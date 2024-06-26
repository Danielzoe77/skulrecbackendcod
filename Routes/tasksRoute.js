const express = require('express');
// const Tasked = require ('../model.js');
const {  createTask, getTask,getTaskById,deleteTask} = require ('../controllers/taskControllers')


const router = express.Router()

//creat a task
router.post('/api/task', createTask);

 //get all task

 router.get('/task', getTask);

  //get a single task
 router.get('/task/:id', getTaskById);

 //delete a single task
 router.delete('/task/:id', deleteTask);

module.exports = router