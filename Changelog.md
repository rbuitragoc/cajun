What's New in v0.7.4
====================
- When a presenter is entering a training's time, only the format `HH:MM` should be accepted

What's New in v0.7.3
====================
- Do not display past training sessions when "show me upcoming sessions" is invoked

What's New in v0.7.2
====================
- Add the command to publish (to a configurable channel only) the link to COPASO  gdoc template

What's New in v0.7.1
====================
- A bot is not a player, so points assigned to bot shouldn't be valid

What's New in v. 0.7.0
======================
- As an user I can rate sessions that I have attended

What's New in v. 0.5.5
======================
- When giving only 1 point, it won't expect the word "points"
- You don't need to name "collabot" in all lowercase to get bot's attention

What's New in v. 0.5.4
======================
- support addressing users with @ when giving points
- when giving 1 point, you are not required to say "points"

What's New in v. 0.5.3
======================
- Added support for specifying a reason when giving points

What's New in v. 0.5.2
======================
- Bot can now join private groups (only those it's been invited to)

What's New in v. 0.5.1
======================
- You cannot assign points to yourself anymore. Hey! That's just fair!

What's New in v. 0.5.0
======================
- Environment variables further independence
- As an HR user I can see a list of attendants to a session

What's new in v. 0.4.0
======================
- Environment variables isolation to ease release process (Env variable for "environment")
- An user can create (register) a new training (BnL) session with all the information associated to it
- An user can register (enroll) to an existing, upcoming BnL session
- Stabilization of dependencies versions and adde dinfo about the project in package.json

What's new in v. 0.3.0
======================
- A separate set of infrastructure for PROD was created (stability enhanced)
- An HR user can authorize another user to be a presenter

What's New in v. 0.2.0
======================
- Filters for 'top' operation are available: Bot top now takes two optional arguments: a period of time (day, week, month, year) and a channel. Those values are used to filter top scores data.
- web tier now finds the app endpoints using config file or environment properties (appUrls)
- minor bug fixes

What's New in v. 0.1.0
======================
- Collabot will support ony one instance in backend (guid)
- Web interface uses now a switch component instead of two buttons
- commands now require the bot name as specified in config file
- staged conversation with the bot is now supported (greeting)
