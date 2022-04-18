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
