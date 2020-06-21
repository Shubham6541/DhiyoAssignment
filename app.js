const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const gql = require('graphql-tag');
const express = require('express');
const graphqlHttp = require('express-graphql');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');
const {MONGODB} = require('./config.js');

const app = express();
const graphQlSchema = require('./graphql/typeDefs');
const graphQlResolvers = require('./graphql/resolvers/index');
app.use(bodyParser.json());

app.use(
    '/graphql',
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