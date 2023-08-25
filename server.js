const http = require('http');
const fs = require('fs');
const qs = require('querystring');
const url = require('url');

function handleRequest(req, res) {
  var store = '';

  req.on('data', (chunk) => {
    store += chunk;
  });

  req.on('end', () => {
    // ------------II. For CREATE Operation---------------------------//
    if (req.method === 'POST' && req.url === '/users') {
      res.statusCode = 201;
      //   console.log(store); // returns string
      let parsedJSONData = JSON.parse(store); // converts to object
      //   console.log(parsedJSONData); // returns object

      /*NOTE:-  Open file for writing. A file is created if it doesn’t exist.
                'wx'-> It is the same as ‘w’ but fails if the path exists.*/
      fs.open(`./users/${parsedJSONData.username}.json`, 'wx', () => {
        console.log(`${parsedJSONData.username} created!!`);
      });
      fs.writeFile(
        `./users/${parsedJSONData.username}.json`,
        store, // given store insted of parsedJSONData because writeFile() dosen't want an object passed.
        (err, content) => {
          err
            ? console.log(`Error Writing Data into users folder`)
            : console.log(
                `Data written successfully into ./users/${parsedJSONData.username}.json`
              );
        }
      );

      file_descriptor = fs.openSync(`./users/${parsedJSONData.username}.json`);
      fs.close(file_descriptor, (err, content) => {
        err
          ? console.log(`Error CLOSING file after it is written`)
          : console.log(`./users/${parsedJSONData.username}.json File Closed`);
      });

      res.end(`${parsedJSONData.username} CREATED on Server!!!`);
    }

    // ------------II. For Read (GET) Operation---------------------------//
    else if (req.method === 'GET') {
      console.log(req.url);
      //   console.log(store);
      let parsedUrl = url.parse(req.url);
      console.log(parsedUrl.pathname); ///users
      //   console.log(qs.parse(parsedUrl.query)); // parsedUrl.query returns -> username=aseshad and qs.parse(parsedUrl) returns -> an object of that again. like  { username: 'random1' }. Using this we can grab the usename to read a file with that username

      let queryStringObject = qs.parse(parsedUrl.query);
      console.log(queryStringObject.username); //aseshad

      if (parsedUrl.pathname === '/users' && req.method === 'GET') {
        fs.createReadStream(`./users/${queryStringObject.username}.json`).pipe(
          res
        );
      }
      //   The above createReadStream gives the data of the particular username's (entered via url) json file data back to client, on requesting a GET request.
    }

    //-------------III. For UPDATE Operation -----------------------------//
    else if (req.method === 'PUT') {
      console.log(req.url);
      let parsedUrl = url.parse(req.url);
      console.log(parsedUrl.pathname); ///users
      let queryStringObject = qs.parse(parsedUrl.query);
      console.log(queryStringObject.username); //aseshad

      fs.open(
        `./users/${queryStringObject.username}.json`,
        'r+', // 'r+' ensures that file already exists
        (err, content) => {
          //remove the content of file using `fs.ftruncate`
          err
            ? console.log(`Error Opening the file while updating`)
            : fs.ftruncate(content, () => {
                err
                  ? console.log(`Error truncating the file while updating`)
                  : console.log(`Truncated the existing file while updating`);
              });

          fs.writeFile(
            `./users/${queryStringObject.username}.json`,
            store,
            () => {
              err
                ? console.log(`Error writing into the file while updating`)
                : console.log(`Written into file while updating with PUT!!`);

              fs.close(content, (err, content) => {
                err
                  ? console.log(
                      `Error CLOSING file after it is updated with PUT`
                    )
                  : res.end(
                      `./users/${queryStringObject.username}.json File UPDATED!!`
                    );
              });
            }
          );
        }
      );
    }

    //--------------IV. For Delete Opeartion -----------------------------//
    else if (req.method === 'DELETE') {
      console.log(req.url);
      let parsedUrl = url.parse(req.url);
      console.log(parsedUrl.pathname); ///users

      let queryStringObject = qs.parse(parsedUrl.query);
      console.log(queryStringObject.username); //aseshad

      fs.unlink(
        `./users/${queryStringObject.username}.json`,
        (err, content) => {
          err
            ? console.log(err)
            : res.end(
                `${queryStringObject.username} file DELETED from Server!!`
              );
        }
      );
    }

    // Error condition - requested url is other than above routes
    else {
      res.statusCode = 404;
      res.end(`Page Not Found!!`);
    }
  });
}

var server = http.createServer(handleRequest);
server.listen(4000, () => {
  console.log(`Server is listening on port 4000`);
});
