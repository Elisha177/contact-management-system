const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
//const { required } = require("joi")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false },
    resetCode: { 
        type: String,
        default: null },
} ,{ timestamps: true });

UserSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,12);
    next();
})

const User = mongoose.model('User',UserSchema);

module.exports = User;