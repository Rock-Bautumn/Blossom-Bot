## Blossom Bot


This bot connects to the twitch.tv chat service to accept commands from viewers,
these commands generate and maintain plants that are displayed in the streamer's
video as a browser source overlay for their video compositor.


### Installation


To get started with Blossom Bot, first clone the repository to a local folder.
You will also need a MySql server configured with the provided MySql script: `setup_mysql_dev.sql`,
as well as Node.js.

Inside the `.env` file, enter in your channel name, and your oauth token.
(Generate your own unique oauth token with https://twitchapps.com/tmi/)


### Usage


To start using Blossom Bot, add a new browser source to your OBS software in the preferred
scene. For the URL path, put in `http://localhost:5002/api/overlay/<YOUR_CHANNEL_DISPLAY_NAME>`.
The URL path is case sensitive, therefore you must put in your channel name EXACTLY how it is
displayed on Twitch. (ex. if your name is MajorLoaf, the path would be http://localhost:5002/api/overlay/MajorLoaf). Set the browser source dimensions to 1920x220px. It will be wide, and very short.

Finally to start the bot, open a terminal and navigate to the folder you cloned the repository to
and type `./server.js` into the command line, and Blossom Bot will be running!

Blossom Bot watches chat for users who are active, and therefore, you will need to have said 
something in chat for it to register you are active. Say anything, like "Hello bot", and you are
good to start entering commands.
