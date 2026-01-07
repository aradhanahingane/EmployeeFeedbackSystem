const mongoose = require('mongoose');

const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        required: true,
        default: 0
    }
});

const feedbackSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    },
    loginId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Login',
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const Login = mongoose.model('Login', LoginSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = { Login, Feedback };