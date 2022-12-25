require('dotenv').config();
const PORT = 3000;
const express = require('express');
const server = express();
const { client } = require('./db');
client.connect();
const apiRouter = require('./api');

server.listen(PORT, () => {
  console.log('The server is up on port', PORT)
});


const morgan = require('morgan');
server.use(morgan('dev'));

server.use(express.json())


server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");
  
  next();
});

server.get('/add/:first/to/:second', (req, res, next) => {
  res.send(`
  
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Juicebox API</title>
  </head>
  <body>
  <h1>JuiceBoxSunsetKiss</h1>
  <h2>AnimeEnding</h2>
  <h3>/users</h3>
  <ul>
  <li>GET /</li>
  <li>POST /register</li>
  <li>POST /login</li>
  <li>PATCH /:userId</li>
  <li>DELETE /:userId</li>
  </ul>
  <h3>/Posts</h3>
  <ul>
  <li>GET /</li>
  <li>POST /</li>
  <li>PATCH /:postId</li>
  <li>DELETE /:postId</li>
  </ul>
  <h3>/Tags</h3>
  <ul>
  <li>GET /</li>
  <li>GET /:tagName/posts</li>
  </ul>
  <h2>Summer Days...Drifting away...</h2>
  </body>
  </html>
  `)
})
server.use('/api', apiRouter);