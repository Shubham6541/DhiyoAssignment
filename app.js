const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {graphqlUploadExpress} = require('graphql-upload');
const fs = require('fs');
const {MONGODB} = require('./config.js');
const Authorization = require('./middleware/authorization');
const PORT = process.env.PORT || 8080;
const app = express();
const graphQlSchema = require('./graphql/typeDefs');
const graphQlResolvers = require('./graphql/resolvers/index');
const Router = require('./routes/reset-password')
app.use(bodyParser.json());

app.use(Authorization);
app.get('/', (req, res) => {
    fs.readFile("views/welcomePage.html", function (error, data) {
        if (error) {
            res.writeHead(404);
            res.write('Contents you are looking are Not Found');
        } else {
            res.write(data);
        }
        res.end();
    });
});

app.use('/api', Router);
app.use(
    '/graphql',
    graphqlUploadExpress({maxFileSize: 10000000, maxFiles: 10}),
    graphqlHttp({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
);

mongoose
    .connect(MONGODB, {useNewUrlParser: true})
    .then(() => {
        console.log('MongoDB Connected');
        return app.listen(PORT);
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`);
    }).catch(err => {
    console.log(err);
});