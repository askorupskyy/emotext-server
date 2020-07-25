# Messaging App API

# Dev Environment

Make sure **Docker** is installed on your computer and that you have an account in it.

Clone the project onto your own machine.

Run the `docker-compose build` and `docker-compose up` commands to run the project.

Run the `docker-compose down` command to close the project.

# Production Environment

Currenly implemented with **Docker** but really easy to run.

Use `docker-compose -f "deploy-docker-compose.yml" build` and `docker-compose -f "deploy-docker-compose.yml" up` to run the deploy enviroment.

**TODO: setup Nginx**

**The server and the database will always be running unless you use the command to close it**

The following commands are responsible for testing, installing, and starting the project **both on Node and Python**

# Testing Enviroment

Use `docker-compose -f "docker-compose-ci.yml" build` and `docker-compose -f "docker-compose-ci.yml" up` to run the tests for the **Node** server.

# Database Tables

**CHECK THE MODELS FOLDER TO SEE THE STRUCTURE OF THE OBJECTS THAT WILL BE RETURNED BY THE API**

# API response structure

Every time the API gets a request, it will return the data in the following structure:

```
{
  success: true/false,
  message: 'Yay, Cool'/'Failure with the code',
  ((optionally depending on the api)user): (user data)
}
```

With APIs like Verify Token you can check the success of the operation by looking at the success state.

If it's true it's valid

If not, then the message will tell you why.

# API docs

[Auth - users and authentication](#auth) – TESTED

[Contacts](#contacts) – TESTED

[Chats - and chats](#chat) – TESTED

[Messaging](#messaging)

[Group Chats](#groups)

## Auth

[Signup](#signup)

[Signin](#signin)

[Verify Token](#verify)

[Logout](#logout)

[Get User By Token](#get-user-by-token)

[Get Reset Token](#get-reset-token)

[Verify Reset Token](#verify-reset-token)

[Reset Password](#reset-password)

[Get User By ID](#get-user-by-id)

[Change Bio](#change-bio)

[Update Profile Picture](#update-profile-picture)

[Change Privacy Settings](#change-privacy-settings)

## Contacts 

[Find Contacts](#find-contacts)

[Send Friend Request](#send-friend-request)

[Ignore Friend Request](#ignore-friend-request)

[Decline Friend Request](#decline-friend-request)

[Cancel Friend Request](#cancel-friend-request)

[Accept Friend Request](#accept-friend-request)

[Rename Contacts](#rename-contacts)

[Delete Contact](#delete-contacts)

[Get Friend Requests](#get-friend-requests)

[Get Contacts](#get-contacts)


### Signup

Request URL `http://{our_ip}:5000/api/auth/signup/`

Method - **POST**

Accepts a **name**, a **username**, an **email** and a **password** in the body.

Creates an account, later a user should be redirected to the login page to login or he should be logged in using another API call.


### Signin

Request URL `http://{our_ip}:5000/api/auth/signin/`

Method - **POST**

Accepts an **email** and a **password** in the body.

**An email can either be a username or an email, it's just a field name**

Returns a user session token,

which should be stored in the device/browser to identify the user AND to keep him signed in.


### Verify

Request URL `http://{our_ip}:5000/api/auth/verify/`

Method - **GET**

Accepts an authentication **token** in the query.

Returns whether the token is valid, check the **success** variable.

Should be used on app startup to check whether the user login session is still valid.


### Logout

Request URL `http://{our_ip}:5000/api/auth/logout/`

Method - **GET**

Accepts an authentication **token** in the query.

Deactivates the user login session.


### Get User By Token

Request URL `http://{our_ip}:5000/api/auth/get-user-by-token/`

Method - **GET**

Accepts an authentication **token** in the query.

Gives away a **user** object containing all info about the user.


### Get Reset Token

Request URL `http://{our_ip}:5000/api/auth/get-reset-token/`

Method - **POST**

Accepts an **email** in the body.

Sends an email reset token to the email that was gives.


### Verify Reset Token

Request URL `http://{our_ip}:5000/api/auth/verify-reset-token/`

Method - **GET**

Accepts a password reset **token** in the query.

Returns whether the password reset token is valid and if it can be used to reset the password.

Should be used on the password reset screen to check if the token you entered is valid.


### Reset Password

Request URL `http://{our_ip}:5000/api/auth/reset-password/`

Method - **POST**

Accepts a password reset **token** and the new **password** in the body.

Changes the password to the one you provided.


### Get User By ID

Request URL `http://{our_ip}:5000/api/auth/get-user-by-id/`

Method - **GET**

Accepts an authentication **token** in the query.

Returns the **user** object.


### Change Bio

Request URL `http://{our_ip}:5000/api/auth/change-bio/`

Method - **POST**

Accepts an authentication **token** and the new **bio** in the body.

Changes you bio to the new one.


### Update Profile Picture

**NOT IMPLEMENTED YET**

Request URL `http://{our_ip}:5000/api/auth/update-profile-picture/`

Method - **POST**

Accepts an authentication **token** and the **profilePicture** file in the body.


### Change Privacy Settings

Request URL `http://{our_ip}:5000/api/auth/change-privacy-settings/`

Method - **POST**

Accepts an authentication **token**, **seeEmail**, **textMe**, **seeRealName** in the body.

**Important**

**All the variables except for the token HAVE TO BE NUMBERS**

**0 -- ALLOW EVERYBODY**

**1 -- ALLOW CONTACTS ONLY**

**2 -- ALLOW NOBODY**


### Find Contacts

Request URL `http://{our_ip}:5000/api/contacts/find-contacts/`

Method - **GET**

Accepts the **searchQuery** in the query.


### Send Friend Request

Request URL `http://{our_ip}:5000/api/contacts/send-friend-request/`

Method - **POST**

Accepts the **token** and the **friend** ID in the query.


### Ignore Friend Request

Request URL `http://{our_ip}:5000/api/contacts/ignore-friend-request/`

Method - **POST**

Accepts the **token** and **requestID** in the body.


### Decline Friend Request

Request URL `http://{our_ip}:5000/api/contacts/decline-friend-request/`

Method - **POST**

Accepts the **token** and **requestID** in the body.


### Cancel Friend Request

Request URL `http://{our_ip}:5000/api/contacts/cancel-friend-request/`

Method - **POST**

Accepts the **token** and **requestID** in the body.

**ONLY THE USER WHO SENT THE REQUEST CAN CANCEL IT**


### Accept Friend Request

Request URL `http://{our_ip}:5000/api/contacts/accept-friend-request/`

Method - **POST**

Accepts the **token** and **requestID** in the body.


### Rename Friend

Request URL `http://{our_ip}:5000/api/contacts/rename-friend/`

Method - **POST**

Accepts the **token** and **friendID** and **name** in the body.


### Delete Friend

Request URL `http://{our_ip}:5000/api/contacts/decline-friend-request/`

Method - **POST**

Accepts the **token** and **friendID** in the body.


### Get Friend Requests

Request URL `http://{our_ip}:5000/api/contacts/get-friend-requests/`

Method - **GET**

Accepts the **token** in the body.

**WILL RETURN THE FRIEND REQUEST OBJECTS**

```requests```


### Get Contacts

Request URL `http://{our_ip}:5000/api/contacts/get-friend-requests/`

Method - **GET**

Accepts the **token** in the body.

**WILL RETURN THE FRIEND REQUEST OBJECTS**

```contacts```
