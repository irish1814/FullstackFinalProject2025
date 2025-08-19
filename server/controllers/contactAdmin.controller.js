import MessageModel from "../models/Message.model.js";


export const getMessages = async (req, res, next) => {
    try {
        const messages = await MessageModel.find();
        res.status(200).send({
            success: true,
            data:
                { messages: messages }
        });
    } catch (error) {
        next(error);
    }
}

export const getMessageById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await MessageModel.findById(id);
        res.status(200).send({
            success: true,
            data:
                { message: message }
        });
    } catch (error) {
        next(error);
    }
}

export const createMessage = async (req, res, next) => {
    try {
        const { id, problemDescription } = req.body;
        const message = new MessageModel({
            sender: id,
            content: problemDescription
        })
        await message.save();
        res.status(201).send({
            success: true,
            data:
                { message: message }
        });
    } catch (error) {
        next(error);
    }
}

export const updateMessage = async (req, res, next) => {
    try {
        const { id, problemDescription, status } = req.body;
        const newMessage = MessageModel.findByIdAndUpdate(
            { id },
            { $set: { content: problemDescription, status: status } }
        );
        await newMessage.save();
        res.status(201).send({
            success: true,
            data:
                { message: newMessage }
        });
    } catch (error) {
        next(error);
    }
}