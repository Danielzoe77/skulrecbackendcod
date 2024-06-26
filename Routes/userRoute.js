const express = require('express');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

const {registerUser, 
    loginUser,
     logoutUser,
      getUser,
       loginStatus, 
       updateUser,
        changePassword,
         forgotPassword,
         }  = require('../controllers/userController');

router.post('/register', registerUser);
//login
router.post('/login', loginUser);
//logout
router.get('/logout',logoutUser);
//getUser
router.get('/:id', getUser);
 //loginstatus
router.get('/loginStatus',loginStatus);
 //updateUser
 router.patch('/updateUser/:id',protect, updateUser);
 //change password
 router.patch('/changePassword/:id', changePassword);
 //forgot password
 router.post('/forgotPassword', forgotPassword);
 //reset password
//  router.put('/resetPassword/:resetToken', resetPassword);

module.exports = router;