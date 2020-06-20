const {gql} = require('apollo-server');

module.exports = gql`
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
  input RegisterInput {
    username: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    resetPassword(username: String!, currentPassword: String!, newPassword: String!): User!
    forgotPassword(username: String!, email: String!): Notification!
    forgotPassword1(username: String!, email: String!): User!
  }
  
  type Query{
  getUser(username:String!): User!
  }
`;