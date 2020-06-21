# messaging-app

# Development Environment

Make sure **Node.js** in installed on your computer.

Clone the project onto your own machine.

Navigate to the server folder and run `npm install` or `sudo npm install` if on Linux.

Run `npm start` to start the server.

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

[Auth (users and authentication)](#auth)

[Chats (messaging and chats)](#chat)

[Friendships](#friendships)

[Media](#media)

## Auth - 80% Done

[Login](#login) - Done and Tested

[Logout](#logout) - Done and Tested

[Signup](#signup) - Done and Tested

[Verify User Session Token](#verify-token) - Done and Tested

[Profile Picture Change](#profile-pic) - Not Coded Yet

[Profile Bio Change](#profile-bio-change) - Not Coded Yet

[Get Password Reset Token](#get-reset-token) - Done

[Verify Reset Token](#verify-reset-token) - Done

[Password Reset](#reset-password) - Done and Tested

[Get User By ID](#get-user-by-id) - Done and Tested

[Get User By Token](#get-user-by-token) - Done and Tested


## Chat - 50% Done

[Send Message](#send-message) - Done and Tested

[Load chat info](#load-chat-info) - Done and Tested

[Create a Chat](#create-chat) - Done and Tested (Planning to remove and find an alternative)

[Load Messages](#load-messages) - Done

[Load Chats](#load-chats) - Done and Tested


### Login

Request URL `http://{our_ip}:5000/api/auth/signin/`

Method - **POST**

Accepts an **email** and a **password** in the body.

Returns a user session token,

which should be stored in the device/browser to identify the user AND to keep him signed in.


### Logout

Request URL `http://{our_ip}:5000/api/auth/logout/`

Method - **GET**

Accepts a user session token in the query, which could be retreived from the device memory.


### Signup

Request URL `http://{our_ip}:5000/api/auth/signup/`

Method - **POST**

Accepts **firstName**, **lastName**, an **email**, and a **password** in the body.


### Verify Token

Request URL `http://{our_ip}:5000/api/auth/verify/`

Method - **GET**

Accepts the **token** in the query.

Will be used to check if the current session is valid and if is not, throw the client back to the login page.


### Get User By Token

Request URL `http://{our_ip}:5000/api/auth/get-user-by-token/`

Method **GET**

Accepts the **token** in the query.

Returns the **user** object with all the info about the user.

Will be used to load a user in the settings.


### Get User By Id

Request URL `http://{our_ip}:5000/api/auth/get-user-by-id/`

Method **GET**

Accepts the **id** in the query.

Returns the **user** object with all the info about the user.

Will be used to load a user in the chat and to check if the message sent by a user is yours while loading the messages or while deleting/editing the message.


### Get Reset Token 

Request URL `http://{our_ip}:5000/api/auth/get-reset-token/`

Method **POST**

Accepts the **email** in the body.

Will send the reset code in the email.

**Code will be valid for 10 mins only!!!.***


### Verify Reset Token 

Request URL `http://{our_ip}:5000/api/auth/verify-reset-token/`

Method **GET**

Accepts the **token** in the body which could be retreived from the email.

Will check if the reset code is valid.


### Reset Password

Request URL `https://{our_ip}:5000/api/auth/reset-password/`

Method **POST**

Accepts the **token** and the **password** in the bydy.

Will reset the password to the new one.


### Send Message 

Request URL `http://{our_ip}:5000/api/chat/send-message/`

Method **POST**

Accepts the message **text**, the **time**, the auth **token**, and the **chatId** in body.


### Load Chat Info

Request URL `http://{our_ip}:5000/api/chat/load-chat/`

Method **GET**

Accepts the **chatId** in the query.

Return the info about the chat: IDs of ppl in it, and the name of the chat.

**ONLY WORKS FOR CHATS WITH 2 PPL IN IT RIGHT NOW**


### Create Chat 

Request URL `http://{our_ip}:5000/api/chat/create-chat/`

Method **POST**

Accepts the **userTo** ID of the User you want to create a chat with and your current **token** in the body.

Will create an empty conversation with the person.


### Load Messages 

Request URL `http://{our_ip}:5000/api/chat/load-messages/`

Method **GET** 

Accepts the **part** (explained later) and the **chatId** in the query.

PART will be the variable responsible for loading a part of messages.

When we load the chat, we will want to load some amount of messages first, then when we scroll up, we'd need more and so on.

**part** is the variable that will be responsible for that.

Initialy it will start with 0, then as we scroll it'd icrement with every 25 messages, and when the messages are cached, we'd want to cache this variable too,

so we wouldn't have to load all the messages again.

Only when we get a new message in real time, or when we see that the last message in the cache != the last message in we see we need to update it.

Will return an array or messages:

```
[
  {
    time: (Time it was sent at),
    fromId: (The ID of the user who sent it)
    text: (The text of the message)
    isRead: (If anyone read the message yet)
    deletedForMe: (If you decided to hide the message for yourself)
    chatId: (The ID of the chat it's in)
  }
]
```


### Load Chats 

Request URL `http://{our_ip}:5000/api/chat/load-chats/`

Method **GET**

Accepts the User Session **token** in the query.

Will return the list of chats and the basic info about them:

```
{
  userOne: (id of the first user),
  userTwo: (id of the second user),
  name: (if it's a group chat),
  isDeleted: (if the chat is deleted),
}
```

The API will be updated soon to support group chats, in that case it will return all of the user IDs, and it there's no name for the chat

it'll return the names of the first few people in it.

For the regular chats it's recommended to get the ID of the current User through the token, and then diplay the name of the other user and his profile picture.

Chats should also be cached, but I recommend we implement that algorithm later.

### Other APIs are still in development
