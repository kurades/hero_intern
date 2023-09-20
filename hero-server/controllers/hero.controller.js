const mongoose = require('mongoose');
const { HeroModel } = require('../models/hero.model');
const { TagModel } = require('../models/tag.model');
const getHeroes = async (req, res) => {
    try {
        const { nameTerm, tagTerm } = req.query;
        const { _id: uuid } = req.user;

        let query = {};
        const nameRegex = new RegExp(nameTerm, 'i');
        query['uid'] = uuid;
        if (nameTerm) query['name'] = { $regex: nameRegex };
        if (tagTerm) {
            const tagIds = tagTerm.map(tag => new mongoose.Types.ObjectId(tag));
            query['tags'] = { $all: tagIds };
        }

        const heroes = await HeroModel.find(query).populate('tags');
        return res.json(heroes);
    } catch (error) {
        console.log(error);
        return res.status(500).send('server error');
    }
};
const getHero = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id: uid } = req.user;
        const checkHeroExist = await HeroModel.findOne({ _id: id, uid }).populate(
            'tags'
        );
        if (!checkHeroExist) {
            res.status(400).json({ message: 'Hero not found' });
        }

        return res.json(checkHeroExist);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Server error' });
    }
};
const addHero = async (req, res, next) => {
    try {
        const body = req.body;
        const { _id: uid } = req.user;
        body['uid'] = uid;

        const hero = new HeroModel(body);
        const result = await hero.save();
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
};

const editHero = async (req, res) => {
    try {
        const body = req.body;
        const { _id: uid } = req.user;
        if (!body.name) res.status(400).json({ message: 'Name field is required' });
        const hero = await HeroModel.findOneAndUpdate(
            { _id: body._id, uid },
            body,
            { new: true }
        );
        if (!hero) res.status(404).json({ message: 'Hero not found' });
        return res.json(hero);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
};

const deleteHero = async (req, res) => {
    try {
        const { id } = req.params;
        const { _id: uid } = req.user;
        const hero = await HeroModel.findOneAndDelete({ _id: id, uid });
        if (!hero) return res.status(404).json({ message: 'Hero not found' });
        return res.json(hero);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
};

const getTags = async (req, res) => {
    try {
        const { _id: uid } = req.user;
        const tags = await TagModel.find({ uid }).lean();
        return res.json(tags);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
};

const addTag = async (req, res) => {
    try {
        const { _id: uid } = req.user;
        const { name } = req.body;
        const existTag = await TagModel.find({ name, uid });
        if (existTag.length !== 0) return res.json(existTag);
        const newTag = new TagModel({ name, uid });
        const result = await newTag.save();
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
};

const deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await TagModel.findByIdAndDelete(id);
        if (!result) return res.status(404).send('Tag not found')
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
};
const editTag = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const result = await TagModel.findByIdAndUpdate(
            id,
            { name: name },
            { new: true }
        );
        if (!result) return res.status(404).send('Tag not found');
        return res.json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send('Server error');
    }
};

module.exports = {
    getHeroes,
    addHero,
    deleteHero,
    editHero,
    getHero,
    getTags,
    addTag,
    editTag,
    deleteTag
};
