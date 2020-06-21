const usersResolvers = require('./users');
const fileUploadResolvers = require('./files');
module.exports = {
        ...usersResolvers.Mutation,
        ...fileUploadResolvers.Mutation

};