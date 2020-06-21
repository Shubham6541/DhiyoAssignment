const usersResolvers = require('./users');
const fileUploadResolvers = require('./files');
module.exports = {
    Mutation: {
        ...usersResolvers.Mutation,
        ...fileUploadResolvers.Mutation
    }
};