const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const session = require('express-session');
const graphqlHttp = require('express-graphql');
const {graphqlUploadExpress} = require('graphql-upload');
const {MONGODB} = require('./config.js');

const app = express();
const flash = require("connect-flash");
const graphQlSchema = require('./graphql/typeDefs');
const graphQlResolvers = require('./graphql/resolvers/index');
const Router = require('./routes/user-router')
app.use(bodyParser.json());
app.use(session({ cookie: { maxAge: 60000 },
    secret: 'woot',
    resave: false,
    saveUninitialized: false}));
app.use(flash());

app.use("/api", Router);

app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }),
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
);

// const server = new ApolloServer({
//     typeDefs,
//     resolvers
// });

mongoose
    .connect(MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log('MongoDB Connected');
        return app.listen( 5000);
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    }).catch(err=> {
        console.log(err);
});