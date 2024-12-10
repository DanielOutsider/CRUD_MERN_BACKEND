const { response } = require('express');
const ChatGroup = require('../models/chatGroup.model');
const { STATUS, ALERTS } = require('../config/constants'); 

// Crear un grupo de chat
const createChatGroup = async (req, res = response) => {
    const { name, members } = req.body;

    try {
        const existingGroup = await ChatGroup.findOne({ name });
        if (existingGroup) {
            return res.status(400).json({
                status: STATUS.ERROR,
                alert: ALERTS.GROUP_EXISTS,
                response: null,
            });
        }

        const group = new ChatGroup({ name, members });
        await group.save();

        return res.status(201).json({
            status: STATUS.SUCCESS,
            alert: ALERTS.GROUP_CREATED,
            response: group,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: STATUS.ERROR,
            alert: ALERTS.CREATE_GROUP_ERROR,
            response: null,
        });
    }
};

const getChatGroups = async (req, res = response) => {
    const userId = req.user.id;

    try {
        const groups = await ChatGroup.find({
            members: userId,
        }).populate('members', 'name email');

        return res.status(200).json({
            status: STATUS.SUCCESS,
            alert: 'Grupos obtenidos correctamente',
            response: groups,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: STATUS.ERROR,
            alert: ALERTS.GET_GROUPS_ERROR,
            response: null,
        });
    }
};

module.exports = {
    createChatGroup,
    getChatGroups,
};