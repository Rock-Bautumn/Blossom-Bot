#!/usr/bin/node

const fetch = require('node-fetch');

let url = "http://localhost:5002/api/viewtime/MajorLoaf/MariachiMayhem";
// https://api.github.com/users/github

// 'http://api.icnd.com/jokes/random/10/api/1'
fetch(url)
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
