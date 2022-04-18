#!/usr/bin/node

let ourObj = {"MajorLoaf":{},"LoudReading":{"MajorLoaf":{"cares":true,"earnedcredit":true}}}

for (const [channel, channeldata] of Object.entries(ourObj)) {
  console.log(`channeldata is ${JSON.stringify(channeldata)}`)
  for (const [viewer, viewerdata] of Object.entries(channeldata)) {
    console.log(`viewerdata ${JSON.stringify(viewerdata)}`)
    if (viewerdata["cares"] === true) { viewerdata["earnedcredit"] = false; }
  }
}

console.log(JSON.stringify(ourObj))

context = {"badge-info":null,"badges":{"premium":"1"},"color":"#8A2BE2","display-name":"MajorLoaf","emotes":null,"first-msg":false,"flags":null,"id":"33c13f39-c15d-4af9-90a5-9d45c43d852f","mod":false,"room-id":"766450989","subscriber":false,"tmi-sent-ts":"1650318589804","turbo":false,"user-id":"609358561","user-type":null,"emotes-raw":null,"badge-info-raw":null,"badges-raw":"premium/1","username":"majorloaf","message-type":"chat"}

console.log(context.subscriber);

let animals = ["!blossom add dogmeat", "birdo", "dog5"]

if( /^!blossom add /.test(animals[0]) ){
  console.log("it's a match")

  // a bird :D
}
else {
  console.log("not a match")
}
