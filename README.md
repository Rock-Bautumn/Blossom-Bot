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


### Functionality


Blossom Bot watches chat for users who are active and chatting. Based on user activity, a user will generate banked watch time. This
watch time is then credited to the user in the Bot database. When the user executes the command `!water` in chat, this credited watch
time is used to "water" the plant. Users who watch more often and chat frequently will accrue more banked time, and their plant will
in turn get more water, and level up faster. When the user starts, they begin at level 0 with just the basic pot shown on the overlay.
After 1 hour of chat activity, the user should have enough banked time, that using `!water` will advance their plant to the next level.
Past that point, plant leveling is exponential, and getting to levels 2-5 will take a lot of chat activity and watch time.


### Commands


To start using Blossom Bot in stream, simply type `!blossom`, and you should get a welcome message
from Blossom telling you that you've been added. At the current time, the only people able to 
use the `!blossom` command for themselves, are moderators, subscribers, and the streamer themselves.

If you would like to add a viewer on your channel who is not subscribed, but would like to
participate in the fun, a moderator or the broadcaster must enter the command `!blossom add <VIEWER_NAME>`, the bot will then respond in chat letting you know that user has been added.

To remove yourself from Blossom Bot, use the command `!blossom delete <USERNAME>`, this command can also be used by moderators and
the channel broadcaster to remove users from Blossom Bot.

To add banked watch time to your plant, and water it, any user may use the command `!water` in chat to water their own plant, and start
leveling up their plant. 




#### [Authors](https://github.com/Rock-Bautumn/Blossom-Bot/blob/main/AUTHORS.md)
