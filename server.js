#!/usr/bin/node

const express = require('express')
const mysql = require('mysql2');
var cors = require('cors');
const fs = require('fs');

const app = express()
const expressport = 5002
app.use(cors())

const tmi = require('tmi.js');
require('dotenv').config();

const fetch = require('node-fetch');

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
let joinChans = [];
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
      joinChans.push(item.channelname);
      console.log(`inChat: ${JSON.stringify(inChat)}`);
    }
  });
});
console.log(`inChat: ${JSON.stringify(inChat)}`);

let overlayhtml = "";
fs.readFile('template/test.html', 'utf8', (err, data) => {
  if (err) {console.error(err); return}
  overlayhtml = data;
  console.log(overlayhtml)
}) 

// Define configuration options
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: joinChans
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

  // format the channelname
  let channelname = Object.keys(inChat).find(key => key.toLowerCase() === target.replace('#', ''))
  
  // set the nickname that said the message
  let nickname = context["display-name"];

  // If the command is known, let's execute it
  if (commandName === '!blossom') {
    const num = rollDice();
    // client.say(target, `Welcome to blossombot! ${num}`);
    console.log(`* Executed ${commandName} command`);
    console.log(`context: ${JSON.stringify(context)}`);
    console.log(`target = ${target} ${JSON.stringify(target)}`)
    console.log(`inChat is ${JSON.stringify(inChat)}`)
    console.log(`msg is ${JSON.stringify(msg)}`)
    console.log(`self is ${JSON.stringify(self)}`)
    console.log(`sub is ${context.subscriber}`)
    console.log(`mod is ${context.mod}`)
    if ((context.subscriber === false) && (context.mod === false) && (context.badges.broadcaster !== '1')) {
       client.say(target, `@${context["display-name"]}: You must be subscribed or added by a mod.`);
       return;
      }
    else {
      url = `http://localhost:5002/api/viewtime/${channelname}/${context["display-name"]}`;

      fetch(url, { method: 'POST', body: ''})
        .then(response => {
          if (response.ok) {
            response.json().then((data) => {
              console.log('User added self to database!')
              console.log(data);
              client.say(target, `@${context["display-name"]}, you are in this thing!`)
            });  
          } else {
            if (response.status === 404) {
              console.log('it was a 404')
            }
            else { throw 'There is something wrong'; }
          }
        }).
        catch(error => {
            console.log('something went horribly bad')
            console.log(error);
        });
        return;
    }
  }
  if ( /^!blossom add /.test(commandName) ){
    console.log("triggered !blossom add ")
    username = commandName.split(' ')[2];
    console.log(username);
    console.log(`user mod ${context.mod}`);
    console.log(`is a broadcaster ${context.badges.broadcaster}`);
    if ((context.mod == false) && (context.badges.broadcaster !== '1')) {console.log('failed mod check', JSON.stringify(context)); return; }
    // /api/viewtime/:channelname/:username
    url = `http://localhost:5002/api/viewtime/${channelname}/${username}`;
   
    fetch(url, { method: 'POST', body: ''})
      .then(response => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(`we created the database entry for ${channelname} / ${username}`)
            client.say(target, `@${username}, you are in this thing!`)
            console.log(data);
          });  
        } else {
          if (response.status === 404) {
            console.log('it was a 404')
          }
          else { throw 'There is something wrong'; }
        }
      }).
      catch(error => {
          console.log('something went horribly bad')
          console.log(error);
      });
      return;
  }
  if ( /^!blossom delete /.test(commandName) ){
    console.log("triggered !blossom delete ")
    username = commandName.split(' ')[2];
    if ((context.mod == false) && (context.badges.broadcaster !== '1')) {
        if (username !== context['display-name']) { return; }
        url = `http://localhost:5002/api/viewtime/${channelname}/${context['display-name']}`;
   
        fetch(url, { method: 'DELETE', body: ''})
          .then(response => {
            if (response.ok) {
              response.json().then((data) => {
                console.log(`we deleted the database entry for ${channelname} / ${context['display-name']}`)
                client.say(target, `Goodbye @${context['display-name']}, you are out this thing!`)
                console.log(data);
              });  
            } else {
              if (response.status === 404) {
                console.log('it was a 404')
              }
              else { throw 'There is something wrong'; }
            }
          }).
          catch(error => {
              console.log('something went horribly bad')
              console.log(error);
          });
            return;
          }
    // /api/viewtime/:channelname/:username
    url = `http://localhost:5002/api/viewtime/${channelname}/${username}`;
   
    fetch(url, { method: 'DELETE', body: ''})
      .then(response => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(`we deleted the database entry for ${channelname} / ${username}`)
            client.say(target, `Goodbye @${username}, you are out this thing!`)
            console.log(data);
          });  
        } else {
          if (response.status === 404) {
            console.log('it was a 404')
          }
          else { throw 'There is something wrong'; }
        }
      }).
      catch(error => {
          console.log('something went horribly bad')
          console.log(error);
      });
      return;
  }
  if (commandName === "!water") {
    url = `http://localhost:5002/api/viewtime/${channelname}/${context['display-name']}`;
    console.log('triggered water command!')
    fetch(url, { method: 'GET'})
      .then(response => {
        if (response.ok) {
          response.json().then((data) => {
            console.log('Viewer with plant found')
            console.log(data);
            url = `http://localhost:5002/api/water/${channelname}/${context['display-name']}`;
            fetch(url, { method: 'PUT', body: ''})
              .then(response => {
                if (response.ok) {
                  response.json().then((data) => {
                    console.log('Water command executed!')
                    console.log(data);
                    client.say(target, `@${context['display-name']}; You watered your flower!`)
                  });  
                } else {
                  if (response.status === 404) {
                    console.log('it was a 404')
                  }
                  else { throw 'There is something wrong'; }
                }
              }).
              catch(error => {
                  console.log('something went horribly bad')
                  console.log(error);
              });
          });  
        } else {
          if (response.status === 404) {
            console.log('it was a 404')
          }
          else { throw 'There is something wrong'; }
        }
      }).
      catch(error => {
          console.log('something went horribly bad')
          console.log(error);
      });
    
  }
  console.log(`nickname is ${context["display-name"]}`)
  // let nick = context.display-name;
  
  let nick = context["display-name"]
  checkIsPlanter(channelname, nick)
}

// function to check memory then database for plant
function checkIsPlanter (channelname, viewername) {
  console.log(`channel: ${channelname} viewer: ${viewername}`)
  // var myObject = { "mIxeDCaSEKeY": "value" };

  // var searchKey = 'mixedCaseKey';
  //var asLowercase = channelname.toLowerCase();
  let thingerton = inChat[channelname];
  console.log(inChat['channelname'])
  console.log(`thingerton ${JSON.stringify(thingerton)}`)
  if (thingerton[viewername] === undefined) {
    console.log("it wasn't there")
    thingerton[viewername] = {};
    // let fchannelname = Object.keys(inChat).find(key => key.toLowerCase() === asLowercase)
    let url = `http://localhost:5002/api/viewtime/${channelname}/${viewername}`;

    fetch(url)
      .then(response => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
            thingerton[viewername]["cares"] = true;
            thingerton[viewername]["earnedcredit"] = true;
            let url = `http://localhost:5002/api/is_viewing/${channelname}/${viewername}/true`;

            fetch(url, { method: 'PUT', body: ''})
              .then(response => {
                if (response.ok) {
                  response.json().then((data) => {
                    console.log(data);
                  });  
                } else {
                  if (response.status === 404) {
                    console.log('it was a 404')
                  }
                  else { throw 'There is something wrong'; }
                }
              }).
              catch(error => {
                  console.log('something went horribly bad')
                  console.log(error);
              });
            url = `http://localhost:5002/api/is_credited/${channelname}/${viewername}/true`;

            fetch(url, { method: 'PUT', body: ''})
              .then(response => {
                if (response.ok) {
                  response.json().then((data) => {
                    console.log('updated is credited')
                    console.log(data);
                  });  
                } else {
                  if (response.status === 404) {
                    console.log('it was a 404')
                  }
                  else { throw 'There is something wrong'; }
                }
              }).
              catch(error => {
                  console.log('something went horribly bad')
                  console.log(error);
              });
          });  
        } else {
          if (response.status === 404) {
            console.log('it was a 404')
            thingerton[viewername].cares = false;
          }
          else { throw 'There is something wrong'; }
        }
      }).
      catch(error => {
          console.log('something went horribly bad')
          console.log(error);
      });

    // thingerton[viewername] = false;
  }
  else {
    console.log("it was there in inChat")
    console.log(JSON.stringify(inChat))
    if ((thingerton[viewername]["cares"] === true) && (thingerton[viewername]["earnedcredit"] !== true)) {
      
      let url = `http://localhost:5002/api/is_viewing/${channelname}/${viewername}/true`;

      fetch(url, { method: 'PUT', body: ''})
        .then(response => {
          if (response.ok) {
            response.json().then((data) => {
              console.log(data);
            });  
          } else {
            if (response.status === 404) {
              console.log('it was a 404')
            }
            else { throw 'There is something wrong'; }
          }
        }).
        catch(error => {
            console.log('something went horribly bad')
            console.log(error);
        });
      url = `http://localhost:5002/api/is_credited/${channelname}/${viewername}/true`;
      
      fetch(url, { method: 'PUT', body: ''})
        .then(response => {
          if (response.ok) {
            response.json().then((data) => {
              console.log('updated is credited')
              console.log(data);
              thingerton[viewername]["earnedcredit"] = true;
            });  
          } else {
            if (response.status === 404) {
              console.log('it was a 404')
            }
            else { throw 'There is something wrong'; }
          }
        }).
        catch(error => {
            console.log('something went horribly bad')
            console.log(error);
        });
      
      }
  }
}

// Function called when the "dice" command is issued
function rollDice () {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
}

function intervalFunc() {
  console.log('Cant stop me now!');
  
  url = 'http://localhost:5002/api/cycle/update';

  fetch(url, { method: 'PUT', body: ''})
    .then(response => {
      if (response.ok) {
        response.json().then((data) => {
          console.log('server cycled the viewer data')
          console.log(data);
        });  
      } else {
        if (response.status === 404) {
          console.log('it was a 404')
        }
        else { throw 'There is something wrong'; }
      }
    }).
    catch(error => {
        console.log('something went horribly bad')
        console.log(error);
    });

  for (const [channel, channeldata] of Object.entries(inChat)) {
    console.log(`channeldata is ${JSON.stringify(channeldata)}`)
    for (const [viewer, viewerdata] of Object.entries(channeldata)) {
      console.log(`viewerdata ${JSON.stringify(viewerdata)}`)
      if (viewerdata["cares"] === true) { viewerdata["earnedcredit"] = false; }
    }
  }
  console.log(`cycle done. ${JSON.stringify(inChat)}`)
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
  
  setInterval(intervalFunc, 1800000);
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
// http://localhost:5002/api/is_credited/${channelname}/${viewername}/true
// update whether viewer is credited for this cycle or not
app.put('/api/is_credited/:channelname/:username/:bool', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    let sqlquery = "oops";
    if (req.params.bool === "true".toLowerCase()) {
      sqlquery = `UPDATE ChannelViews SET is_credited = true WHERE channelname = '${req.params.channelname}' AND username = '${req.params.username}';`;
    }
    else {
      sqlquery = `UPDATE ChannelViews SET is_credited = false WHERE channelname = '${req.params.channelname}' AND username = '${req.params.username}';`;
    }
    con.query(sqlquery, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      if (JSON.stringify(result) !== '[]') { res.send(result) }
      else { res.send(404, "No results"); }
    });
  });
});

// returns overlay html for channel name
app.get('/api/overlay/:channelname', (req, res) => {
  let output = overlayhtml.replace('__REPLACEME__', req.params.channelname);
  console.log(output)
  res.send(output)
})

// api/is_viewing/${channelname}/${viewername}/true
// update whether viewer is viewing or not
app.put('/api/is_viewing/:channelname/:username/:bool', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    let sqlquery = "oops";
    if (req.params.bool === "true".toLowerCase()) {
      sqlquery = `UPDATE ChannelViews SET is_watching = true WHERE channelname = '${req.params.channelname}' AND username = '${req.params.username}';`;
    }
    else {
      sqlquery = `UPDATE ChannelViews SET is_watching = false WHERE channelname = '${req.params.channelname}' AND username = '${req.params.username}';`;
    }
    con.query(sqlquery, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      if (JSON.stringify(result) !== '[]') { res.send(result) }
      else { res.send(404, "No results"); }
    });
  });
});

// update all of the viewers that didn't participate to false, per 30 min cycle period
app.put('/api/cycle/update', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    const sqlquery = 'UPDATE ChannelViews SET banked_time = banked_time + 30 WHERE is_credited = true;';
    con.query(sqlquery, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      if (JSON.stringify(result) !== '[]') {
        // success
        // res.send(result) 
        con.connect(function(err) {
          if (err) throw err;
          const sqlquery = 'UPDATE ChannelViews SET is_watching = false WHERE is_credited = false;';
          con.query(sqlquery, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            if (JSON.stringify(result) !== '[]') {
              // success
              // res.send(result) 
              con.connect(function(err) {
                if (err) throw err;
                const sqlquery = 'UPDATE ChannelViews SET is_credited = false';
                con.query(sqlquery, function (err, result, fields) {
                  if (err) throw err;
                  console.log(result);
                  if (JSON.stringify(result) !== '[]') {
                    // success
                    res.send(result) 
                    
                    
                    }
                  else { res.send(404, "No results"); }
                });
              });
              }
            else { res.send(404, "No results"); }
          });
        });
        
        }
      else { res.send(404, "No results"); }
    });
  });
});

// get plant image by level no
app.get('/images/:imageNo', (req, res) => {
  console.log(req.params)
  imageNo = req.params.imageNo
  if (!(imageNo >= 0) || !(imageNo <= 5)) { res.send(400, "Bad value, flower must be between 0-5"); }
  const filepath = __dirname + '/images/level_' + imageNo + '_flower_in_pot.png'
  res.sendFile(filepath);
})

// get watching chan viewers for channel
app.get('/api/viewers/:channelname', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    const sqlquery = `select username, viewing_time from ChannelViews where channelname = '${req.params.channelname}' and is_watching = true;`;
    con.query(sqlquery, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      let myresult = result;
      let levels = [
        {
          level: 5,
          minimum: 600000,
          imageurl: 'http://localhost:5002/images/5'
        },
        {
          level: 4,
          minimum: 60000,
          imageurl: 'http://localhost:5002/images/4'
        },
        {
          level: 3,
          minimum: 6000,
          imageurl: 'http://localhost:5002/images/3'
        },
        {
          level: 2,
          minimum: 600,
          imageurl: 'http://localhost:5002/images/2'
        },
        {
          level: 1,
          minimum: 60,
          imageurl: 'http://localhost:5002/images/1'
        },
        {
          level: 0,
          minimum: 0,
          imageurl: 'http://localhost:5002/images/0'
        }
      ]

      for (const item of myresult) {
        for (const level of levels) {
          if (item.viewing_time >= level.minimum) { console.log(`${item.username} ${level.imageurl}`); item['levelimageurl'] = level.imageurl; break;} 
        }
      }
      console.log(myresult)
      if (JSON.stringify(result) !== '[]') { res.send(myresult) }
      else { res.send(404, "No results"); }
    });
  });
});

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

// water the plant and push banked time to view time
app.put('/api/water/:channelname/:username', (req, res) => {
  con.connect(function(err) {
    if (err) throw err;
    const sqlquery = `update ChannelViews SET viewing_time = viewing_time + banked_time where is_credited = true and username = '${req.params.username}' and channelname = '${req.params.channelname}'`;

    con.query(sqlquery, function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      if (JSON.stringify(result) !== '[]') {
          // success

        con.connect(function(err) {
          if (err) throw err;
          const sqlquery = `update ChannelViews set banked_time = 0 where username = '${req.params.username}' and channelname = '${req.params.channelname}'`;
      
          con.query(sqlquery, function (err, result, fields) {
            if (err) throw err;
            console.log(result);
            if (JSON.stringify(result) !== '[]') {
                // success
                res.send(result)
              }
            else { res.send(404, "No results"); }
          });
        });

        }
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
