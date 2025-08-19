import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel", // reference to your user
        required: true
    },
    senderAccountNumber: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: "Message cannot be empty"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['closed', 'pending', 'inProgress'],
        default: 'pending'
    }
});

// Update the `updatedAt` timestamp automatically
messageSchema.pre("save", function(next) {
    this.updatedAt = Date.now();
    next();
});

const MessageModel = mongoose.model("MessageModel", messageSchema);

export default MessageModel;
