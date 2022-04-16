#!/usr/bin/node

const express = require('express')
const app = express()
const port = 5002

var shutting_down = false;

app.use(function (req, resp, next) {
 if(!shutting_down)
   return next();

 resp.setHeader('Connection', "close");
 resp.send(503, "Server is in the process of restarting");
 // Change the response to something your client is expecting:
 //   html, text, json, etc.
});

function cleanup () {
  shutting_down = true;
  server.close( function () {
    console.log( "Closed out remaining connections.");
    // Close db connections, other chores, etc.
    process.exit();
  });

  setTimeout( function () {
   console.error("Could not close connections in time, forcing shut down");
   process.exit(1);
  }, 30*1000);

}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/images/:imageNo', (req, res) => {
  console.log(req.params)
  imageNo = req.params.imageNo
  if (!(imageNo >= 0) || !(imageNo <= 5)) { resp.send(400, "Bad value, flower must be between 0-5"); }
  const filepath = __dirname + '/images/level_' + imageNo + '_flower_in_pot.png'
  res.sendFile(filepath);
})

var server = app.listen(port, () => {
  // start db connection
  console.log(`Example app listening on port ${port}`)
})
