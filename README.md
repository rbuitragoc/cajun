![Codeship Status for vpgambit/collabot](https://codeship.com/projects/87838d20-936b-0132-849a-5668b62cd35b/status?branch=dev)

Collabot v. 0.9.3
=================
A fun slack bot to incentive collaboration between developers.


Running it
==========

- Set the mongoDB variables located at config.js in your ~/.bashrc file.
- Type `npm install` and then `npm test` to finally issue `npm start`. 
- Then do a GET to the URL specified in the APPSTART environment variable - that will log the bot into Slack. 


Other tasks
===========

Collabot works over Slack API integration. It's configured by default on one channel, but it can be set to join multiple channels:

* Any user can add the bot to any channel 
* The admins can set the channels the bot is in via the bot integration panel