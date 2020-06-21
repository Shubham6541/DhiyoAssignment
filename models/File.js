const {model, Schema} = require('mongoose');

const fileSchema = new Schema({
    filename: String,
    mimetype: String,
    path: String,
    file:{data: Buffer}
});

module.exports = model("File", fileSchema);