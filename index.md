## BLOCK-writeCode

### Final project

Create a basic `USER CRUD application` using `fs` on a HTTP server where a user can be created and stored in a file, read, updated and should be deleted from the file, all controlled by a node server.

We will be using `POSTMAN` to request an operation on our server.

Folder structure for our app:-

Project folder

- server.js
- users(folder)
  - user1.json
  - user2.json
  - ... other users

Each user will be stored inside users dircetory by creating a file which will be based on user's username which should be unique.

Each user will have fields:-

- name
- email
- username(unique)
- bio

#### Instructions

In our server, we need 4 different routes to handle each operation from CRUD i.e. `create user`, `get user`, `update user` and `delete user`.

You have to handle routes:-

- POST method on `/users` -> to create user
- GET method on `/users?username=xyz` -> to get a single user
- PUT method on `/users?username=xyz` -> to update a user
- DELETE method on `/users?username=xyz` -> to delete a user

#### Note:-

handle an error condition as well where requested url is other than above routes. Send response with status code 404 saying `page not found`.

##### create user(CREATE)

Whenever a `POST` request comes on `/users` with user data from postman

- capture data on server side
- create a file inside data directory using the username from captured data using `fs.open` with `wx` flag.
- check what `wx` flag does ?
- write content of captured data into the file using `fs.writeFile`
- close the file using `fs.close()`
- send response saying user created

Entire code should look like:

```js
// define a users directory at top where all users will be stored
const userDir = __dirname + "/users/";
// OR using path module
// make sure to require path module if using
const userDir = path.join(__dirname, "users/");

// captured data in stringified JSON format
var store = "some data here";
// check for post request coming on '/users'
if (req.url === "/users" && req.method === "POST") {
  // grab the username from store data
  var username = JSON.parse(store).username;
  // check whether this username exists in users directory or not

  // We have to create a file using username + append .json to create a proper file

  // wx flag ensures that given username.json should not already exist in users directory, therwise throws an error

  fs.open(userDir + username + ".json", "wx", (err, fd) => {
    // fd is pointing to newly created file inside users directory
    // once file is created, we can write content to file
    // since store has all the data of the user
    fs.writeFile(fd, store, (err) => {
      // err indicated file was not written
      // if no error, file was written successfully
      // close the file
      fs.close(fd, (err) => {
        // if no err, send response to client
        res.end(`${username} successfully created`);
      });
    });
  });
}
```

Handle all the error encountered during file system operation.

##### get a user(READ)

In order to read a user, we need to pass a username whenever doing a request from postman. We pass the username through querystring by doing a GET request on `/users?username=xyz`

- check for a route which is coming on above url using GET method
- parse the url at the top and grab the pathname.
- recall the difference between `req.url` and `parsedUrl.pathname`

```js
if (parsedUrl.pathname === "/users" && req.method === "GET") {
}
```

- grab the username from querystring
- read the content of the username from users directory

```js
fs.readFile(file_path, (err, user) => {
  // send the user through response
});
```

##### delete a user(DELETE)

Delete operation is similar to Get a user.

- listen for a delete request on `/users?username=xyz`
- grab the username from querystring to be deleted
- delete a username from users directory using `fs.unlink` method

##### update a user(UPDATE)

To update a user, we will listen for PUT request on `/users?username=xyz` with some updated data of the user coming form `POSTMAN`.

- create a route to handle update operation
- grab the username from querystring
- open the file(`fs.open`) using username.json from users directory
- use `r+` flag this time, r+ ensures that file already exists
- remove the content of file using `fs.ftruncate`
- add the updated content using `fs.writeFile`
- close the file
- send response to client saying `user updated`

Update operation is similar to create, except

- flags i.e. wx -> create, r+ => update
- during update, first we open file and remove previous content to add updated one from user.
