#!/usr/bin/node

const express = require('express')
const mysql = require('mysql2');

const app = express()
const expressport = 5002

const tmi = require('tmi.js');
require('dotenv').config();


var con = mysql.createConnection({
  host: "localhost",
  user: "blossom_dev",
  password: "blossom_dev_pwd"
});

con.connect(function(err) {
  if (err) throw err;
  sql = "USE blossom_dev_db;"
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("Result: " + JSON.stringify(result));
  });
  console.log("Connected to mysql db!");
});

let inChat = {};
inChat[process.env.CHANNEL_NAME] = {};
console.log(`inChat: ${JSON.stringify(inChat)}`);

con.connect(function(err) {
  if (err) throw err;
  const sqlquery = `SELECT DISTINCT channelname FROM ChannelViews;`;
  con.query(sqlquery, function (err, result, fields) {
    if (err) throw err;
    const data = result.values();
    for (const item of data) {
      console.log(item.channelname);
      inChat[item.channelname] = {};
      console.log(`inChat: ${JSON.stringify(inChat)}`);
    }
  });
});
console.log(`inChat: ${JSON.stringify(inChat)}`);


// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: Object.keys(inChat)
};
console.log(`inChat keys: ${Object.keys(inChat)}`);

// Create a client with our options
const client = new tmi.Client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler (target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName === '!blossom') {
    const num = rollDice();
    client.say(target, `Welcome to blossombot! ${num}`);
    console.log(`* Executed ${commandName} command`);
    console.log(context);
  }
} 

// function to check memory then database for plant
function checkIsPlanter () {
  
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}



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
app.put('/api/banktime/:channelname/:username/:banked_time', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    const sqlquery = `UPDATE ChannelViews SET banked_time = ${req.params.banked_time} WHERE channelname = '${req.params.channelname}' AND username = '${req.params.username}';`;
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
  
})
