const {model, Schema} = require('mongoose');
const userSchema = new Schema({
    username: String,
    password: String,
    email: String,
    createdAt: String,
    uploadedFiles: [Schema.ObjectId]
}, {strict: false});

module.exports = model('User', userSchema);