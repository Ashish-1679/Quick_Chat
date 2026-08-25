const Message = require('../models/message.js');
const User = require('../models/user.js');
const cloudinary = require('../lib/cloudinary.js');
const { io, userSocketMap } = require("../server.js");
const getUsersForSidebar = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: currentUserId } }).select('-password');
    const unseenMessages = {};

    const promises = filteredUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: currentUserId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id.toString()] = messages.length;
      }
    });

    await Promise.all(promises);
    return res.json({ success: true, users: filteredUsers, unseenMessages });
  } catch (error) {
    console.error('Error fetching users for sidebar:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });

    await Message.updateMany(
      { senderId: selectedUserId, receiverId: myId, seen: false },
      { $set: { seen: true } }
    );
            
    return res.json({ success: true, messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { seen: true });
    return res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};
const sendMessage = async (req, res) => {
try{  const {text,image} = req.body;
  const receiverId = req.params.id;
  const senderId = req.user._id;
  let imageUrl;
  if(image){
    const uploadResponse = await cloudinary.uploader.upload(image);
    imageUrl = uploadResponse.secure_url;
}
const newMessage = await Message.create({
  senderId,
  receiverId,
  text,
  image: imageUrl,
});

//emit the new message to the receiver socket
const receiverSocketId = userSocketMap[receiverId];
if(receiverId){
  io.to(receiverSocketId).emit("newMessage",newMessage);
}
 res.json({ success: true, message: newMessage });
}
catch(error){
  console.error('Error sending message:', error);
  return res.status(500).json({ success: false, message: 'Internal server error' });
}};
module.exports = { getUsersForSidebar, getMessages, markMessageAsSeen, sendMessage };