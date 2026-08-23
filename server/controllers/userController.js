const bcrypt = require('bcryptjs');
const User = require('../models/user.js');
const { generateToken } = require('../lib/utils.js');

const signup = async (req, res) => {
        const { email, fullName, password,bio} = req.body;
        try{
            if(!email || !fullName || !password||!bio){
                return res.json({success:false,message:"Missing details"});
            }
            const user  = await User.findOne({email});
            if(user){
                return res.json({success:false,message:"User already exists"});
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password,salt);
            const newUser = await User.create({email,fullName,password:hashedPassword,bio});
            const token = generateToken(newUser._id);
            res.json({success:true,message:"User created successfully",token,userData:newUser});
        }
        catch(error){
            console.log(error.message);
            return res.json({success:false,message:"Error occurred while signing up"});
        }}

    module.exports = { signup };