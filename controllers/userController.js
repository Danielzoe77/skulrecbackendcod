const asyncHandler = require("express-async-handler");
const User = require("../model/userModel");
const Token = require("../model/tokenModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  //validation
  if (!email) {
    res.status(400);
    throw new Error("please enter all email ");
  }
  if (!fullname) {
    res.status(400);
    throw new Error("please enter your name ");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  //checking if user exist
  const userExist = await User.findOne({ email });
  if (userExist) {
    res.status(400);
    throw new Error("email already exists");
  }

  //create user
  const user = await User.create({
    fullname,
    email,
    password,
    confirmPassword: password,
  });

  //generate token
  const token = generateToken(user._id);

  //send http cookies to frontend
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true,
  });
  //console.log(res.cookie);

  if (user) {
    const { _id, fullname, email, password } = user;
    res.status(201).json({ _id, fullname, email, password, token });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please input your email and password");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    res.status(400);
    throw new Error("User cannot be found, please sign up");
  } else {
    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
      res.status(400);
      throw new Error("Invalid password");
    }

    const token = generateToken(user._id);

    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 86400),
      sameSite: "none",
      secure: true,
    });
    // console.log(res.cookie('token'));
    const tokenDoc = new Token({
      token,
      user: user.id,
    });
    await tokenDoc.save();

    if (user && passwordIsCorrect) {
      const { _id, fullname, email, password } = user;
      res.status(201).json({ _id, fullname, email, password, token });
    } else {
      res.status(400);
      throw new Error("Invalid email or password");
    }
<<<<<<< HEAD

    }
    await token.save();
    
  
=======
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
>>>>>>> e5515e3761d749547d399b1d4d4a7f3ba146b6ec
  });

  return res.status(200).json({ message: "Successfully logged out" });
});

//user profile
const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(400).json({ message: "User not  found in db" });
  }
  const user = await User.findById(userId);
  if (user) {
    const { _id, fullname, email } = user;
    res.status(200).json({ _id, fullname, email });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
  console.log(user);
});

const loginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified) {
    return res.status(true);
  }
  return res.status(false);
});

//Update user profile

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const { _id, username, email, photo, phone, bio } = user;
    user.email = email;
    user.username = req.body.username || username;
    user.phone = req.body.phone || phone;
    user.photo = req.body.photo || photo;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.username,
      phone: updatedUser.phone,
      photo: updatedUser.photo,
      bio: updatedUser.bio,
    });
  } else {
    res.status(400);
    throw new Error("User not found");
  }
});

//change password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("+password");

  const { oldPassword, password } = req.body;
  //validate user

  if (!user) {
    res.status(400);
    throw new Error("User not found, please signup");
  }
  if (!oldPassword || !password) {
    res.status(400);
    throw new Error("Please add old and new password");
  }

  //check if old password is correct

  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Old password is incorrect");
  }

  //change password
  user.password = password;
  user.save();
  res.status(200).json({ message: "Password updated successfully" });
});

//forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User does not exist");
  }

  // delete token
  const token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }

  //reset token
  const resetToken =
    crypto.randomBytes(32).toString("hex") + user._id.toString();

  //hashed token
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //save hashed token
  const tokenData = {
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), // 30 minutes
  };
  await new Token(tokenData).save();

  //construct reset url
  const resetURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

  //reset password message
  const message = `
  <h2> Hello, ${user.name} </h2>
  <p>Please use this url to reset your password </p>
  <a href =${resetURL} clicktracking=off>${resetURL}</a>
  <p>Best regards..... </p>
  <p>D-Tech</p>
  `;

  const subject = "Password reset request";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
    res
      .status(200)
      .json({
        success: true,
        message: "password reset link sent to your email",
      });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent,  try again");
  }
  res.send("forgot password");
});



module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword,};