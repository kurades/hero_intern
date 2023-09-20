const { UserModel } = require('../models/user.model');
const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const validateUser = data => {
    const rule = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email(),
        phone: Joi.string().length(10),
        password: Joi.string().min(6).max(100)
    });
    return rule.validate(data);
};

const generateToken = (id) => {
    const MONTH_IN_MILISECOND = 60 * 60 * 24 * 30;
    const TOKEN_SECRET = process.env.TOKEN_SECRET;

    return jwt.sign({ _id: id }, TOKEN_SECRET, {
        expiresIn: MONTH_IN_MILISECOND
    });
}

async function register(req, res) {
    try {
        const { error } = validateUser(req.body);

        if (error) return res.status(400).send(error.details[0].message);
        const checkUserExist = await UserModel.findOne({ name: req.body.name });
        if (checkUserExist) return res.status(400).send('User already exist');

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const user = new UserModel({
            name: req.body.name,
            password: hashPassword
        });

        const newUser = await user.save();
        let newObjectUser = newUser.toObject();
        delete newObjectUser.password;
        res.json({ user: newObjectUser, token: generateToken(newUser._id) });
    } catch (error) {
        console.log(error);
        res.status(500).send('server error');
    }
}

async function login(req, res) {
    const user = await UserModel.findOne({ name: req.body.name })
        .select('+password')
        .lean();
    if (!user) return res.status(404).send('User not found');

    const checkPassword = bcrypt.compare(req.body.password, user.password);
    if (!checkPassword) return res.status(400).send('Password not correct');
    delete user.password;

    return res.status(200).json({ user, token: generateToken(user._id) });
}

async function getUser(req, res) {
    const user = await UserModel.findById(req.params.id).lean();
    if (!user) return res.status(404).send('user not found');
    return res.json(user);
}

async function updateProfile(req, res) {
    try {
        const id = req.user._id;
        const { _id, ...body } = req.body;
        const { error } = validateUser(error.details[0].message);
        if (error) return res.status(400).send(error);
        const newUser = await UserModel.findByIdAndUpdate(id, body, { new: true });
        if (!newUser) return res.status(404).send('User not found');
        return res.json(newUser);
    } catch (error) {
        console.log(error);
        return res.status(500).send('server error');
    }
}

module.exports = { register, getUser, login, updateProfile };
