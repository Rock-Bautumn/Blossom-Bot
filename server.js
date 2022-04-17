#!/usr/bin/node

const express = require('express')
const mysql = require('mysql2');

const app = express()
const expressport = 5002

var con = mysql.createConnection({
  host: "localhost",
  user: "blossom_dev",
  password: "blossom_dev_pwd"
});



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

// get plant image by level no
app.get('/images/:imageNo', (req, res) => {
  console.log(req.params)
  imageNo = req.params.imageNo
  if (!(imageNo >= 0) || !(imageNo <= 5)) { res.send(400, "Bad value, flower must be between 0-5"); }
  const filepath = __dirname + '/images/level_' + imageNo + '_flower_in_pot.png'
  res.sendFile(filepath);
})

// get view time for chan viewer
app.get('/api/viewtime/:channelname/:username', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    const sqlquery = "SELECT viewing_time FROM ChannelViews WHERE channelname = '" + req.params.channelname + "' AND username = '" + req.params.username + "';"
    con.query(sqlquery, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      if (JSON.stringify(result) !== '[]') { res.send(result[0]) }
      else { res.send(404, "No results"); }
    });
  });
});

// create new chanviewer
app.post('/api/viewtime/:channelname/:username', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    const sqlquery = `INSERT INTO ChannelViews (channelname, username) VALUES ('${req.params.channelname}', '${req.params.username}');`;
    con.query(sqlquery, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      if (JSON.stringify(result) !== '[]') { res.send(result) }
      else { res.send(404, "No results"); }
    });
  });
});

// update chanview with new viewing time
app.put('/api/viewtime/:channelname/:username/:viewing_time', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    const sqlquery = `UPDATE ChannelViews SET viewing_time = ${req.params.viewing_time} WHERE channelname = '${req.params.channelname}' AND username = '${req.params.username}';`;
    con.query(sqlquery, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      if (JSON.stringify(result) !== '[]') { res.send(result) }
      else { res.send(404, "No results"); }
    });
  });
});

// delete chanviewer
app.delete('/api/viewtime/:channelname/:username/', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    const sqlquery = `DELETE from ChannelViews WHERE channelname = '${req.params.channelname}' AND username = '${req.params.username}';`;
    con.query(sqlquery, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      if (JSON.stringify(result) !== '[]') { res.send(result) }
      else { res.send(404, "No results"); }
    });
  });
});


// update bank time
app.put('/api/banktime/:channelname/:username/:viewing_time', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    const sqlquery = `UPDATE ChannelViews SET viewing_time = ${req.params.viewing_time} WHERE channelname = '${req.params.channelname}' AND username = '${req.params.username}';`;
    con.query(sqlquery, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      if (JSON.stringify(result) !== '[]') { res.send(result) }
      else { res.send(404, "No results"); }
    });
  });
});

// start the server
var server = app.listen(expressport, () => {
  // start db connection
  console.log(`Example app listening on port ${expressport}`)
  con.connect(function(err) {
    if (err) throw err;
    sql = "USE blossom_dev_db;"
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Result: " + JSON.stringify(result));
    });
    console.log("Connected to mysql db!");
  });
})
