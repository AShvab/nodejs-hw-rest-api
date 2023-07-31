import bcrypt from "bcryptjs";

import User from "../models/user.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

const signup = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(user){
        throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({...req.body, password: hashPassword});

    res.status(201).json({
        email: newUser.email,
        subscription: newUser.subscription,
    })
};

const signin = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({ email });
    if(!user){
        throw HttpError(401, "Email or password is wrong");
    }
    
    const passwordCompare = await bcrypt.compare(password, user.password);
    if(!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const token = "123";
    res.json({
        token,
    })
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
};