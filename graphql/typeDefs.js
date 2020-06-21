const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  type User {
    id: ID!
    email: String!
    token: String!
    username: String!
    createdAt: String!
  }
  type Notification {
    email: String!
    message: String!
  }
   type File {
    id: ID!
    filename: String!
    mimetype: String!
    path: String!
  }
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type RootMutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    resetPassword(username: String!, currentPassword: String!, newPassword: String!): User!
    forgotPassword(username: String!, email: String!): Notification!
    
  }
  
  type RootQuery{
  getUser(username:String!): User!
  }
  schema {
    query: RootQuery
    mutation: RootMutation
}
`);