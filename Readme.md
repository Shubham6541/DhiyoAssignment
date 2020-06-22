#  Assignment
ExpressJS app, enabled with GraphQL.
MongoDB has been used as database and mongoose has been used as ORM.

## Features
```
Register for a user
Login for a User
File upload by a logged in user
Forgot Password 
Reset Password
```
1. Registration : This process requires username, email and password, after user registration it will send user details and token as response.
    #### Note: Enter a valid email address in case you want to test forget password feature.
    ```
    mutation{
      register(registerInput:{
            username:"Shubham**",
            email:"kumarshubham6541@gmail.com",
            password:"1234",
            confirmPassword:"1234"
   }){
        id
        token
        email
        username
        createdAt
      }
    }
    ```

2. Login : This process requires username and password and in return gives back authorization token which can be used to make api calls.
    ```
    mutation{
      login(username:"Shubham",password:"1234"){
        id
        token
        email
      }
    }
    ``` 

3. File upload: A logged in user can be able to upload file with size less than 10MB.
   To upload a file user need to add authorization token in headers.
   
   One can get token from login query.
   
   Set Header
   ``` 
   Authorization  Bearer token
    ``` 
   ```
   mutation uploadFile($file: Upload!) {
     uploadFile(file: $file) {
       username
       path
       id
     }
   ``` 
   To test file upload one can use Altair tool or postman from where image can be uploaded, and the token can be added to the header. 
4. Forgot Password: User just need to query for either username or email. Then a link will be generated and will be sent to the registered email account of the user.
    The expiration time for the link is 1 hour. After that it will become invalid.
    ```
    mutation{
      forgotPassword(username:"Shubham**",email:""){
        message
        email
      }
    }
    ```
    If username is not know, one can use email id too.
    ```
   mutation{
     forgotPassword(username:"",email:"kumarshubham6541@gmail.com"){
       message
       email
     }
   }
    ```
   After this, one link will be sent to registered email address, from where user can be able to reset password.
5. Reset Password: User has to enter a username, current password and new password. After successful reset user can log in with the new password.

    If current password is not valid, it will give wrong credentials. 
    ```
    mutation {
      resetPassword(username: "Shubham**", currentPassword: "1234", newPassword: "12345") {
        token
      }
    }
    ```


## Deployment
Heroku is used as a platform for deployment of application.  https://dhiyo.herokuapp.com/graphql
## How to run it in local machine

```
npm install
npm start
```

The first command will install all the dependencies.

The second command will serve it on port 8080.

http://localhost:8080/
