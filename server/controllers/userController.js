const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const { generateToken } = require('../lib/utils.js');
const cloudinary = require('../lib/cloudinary.js');

const signup = async (req, res) => {
  const { email, fullName, password, bio } = req.body;

  try {
    if (!email || !fullName || !password || !bio) {
      return res.json({ success: false, message: 'Missing details' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({ email, fullName, password: hashedPassword, bio });
    const token = generateToken(newUser._id);

    return res.json({ success: true, message: 'User created successfully', token, userData: newUser });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: 'Error occurred while signing up' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    return res.json({ success: true, message: 'Login successful', token, userData: user });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: 'Error occurred while logging in' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic, fullName, bio } = req.body;
    const userId = req.user._id;
    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(userId, { fullName, bio }, { new: true });
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio, profilePic: upload.secure_url },
        { new: true }
      );
    }

    return res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: 'Error occurred while updating profile' });
  }
};

module.exports = { signup, login, updateProfile };

